import { useEffect, useState } from 'react';
import { notificacionService } from '../services/notificacionService';

/**
 * useNotificaciones: Hook para gestionar el ciclo de vida de alertas.
 * Por defecto programa recordatorios cada 6 horas.
 */
export function useNotificaciones(intervalHours: number = 6) {
  const [permisoConcedido, setPermisoConcedido] = useState<boolean | null>(null);

  useEffect(() => {
    async function inicializar() {
      // 1. Pedimos permiso (Solo ocurre la primera vez)
      const granted = await notificacionService.solicitarPermisos();
      setPermisoConcedido(granted);

      // 2. Si tenemos permiso, programamos los recordatorios periódicos
      if (granted) {
        await notificacionService.programarRecordatorios(intervalHours);
      }
    }

    inicializar();
  }, [intervalHours]);

  /**
   * Función para disparar una alerta rápida desde cualquier botón.
   */
  const testAlert = async () => {
    await notificacionService.enviarPruebaInmediata();
  };

  return {
    permisoConcedido,
    testAlert
  };
}
