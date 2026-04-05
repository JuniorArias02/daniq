import { execute, fetchAll } from '../../../core/database/index';
import { MENSAJES_DANIQ } from '../constants/mensajes';

/**
 * notificacionLogService: Gestiona el historial para evitar repeticiones.
 */
export const notificacionLogService = {
  
  /**
   * Registra que un mensaje fue programado/enviado.
   */
  registrarEnvio: async (mensajeId: string): Promise<void> => {
    try {
      await execute(
        'INSERT INTO notificacion_logs (mensaje_id) VALUES (?)',
        [mensajeId]
      );
    } catch (e) {
      console.error('Error registrando log de notificación:', e);
    }
  },

  /**
   * Obtiene una frase aleatoria pero que NO esté en los últimos logs.
   */
  obtenerFraseDiferente: async (): Promise<any> => {
    try {
      // 1. Miramos los últimos 5 mensajes enviados
      const ultimosLogs: any[] = await fetchAll(
        'SELECT mensaje_id FROM notificacion_logs ORDER BY enviado_at DESC LIMIT 5'
      );
      const idsUsados = ultimosLogs.map(l => l.mensaje_id);

      // 2. Filtramos la lista oficial de Daniq para quitar esos 5
      const opcionesDisponibles = MENSAJES_DANIQ.filter(m => !idsUsados.includes(m.id));

      // 3. Elegimos uno de los que quedan
      const pool = opcionesDisponibles.length > 0 ? opcionesDisponibles : MENSAJES_DANIQ;
      const index = Math.floor(Math.random() * pool.length);
      
      return pool[index];
    } catch (e) {
      console.error('Error eligiendo frase diferente:', e);
      return MENSAJES_DANIQ[0];
    }
  }
};
