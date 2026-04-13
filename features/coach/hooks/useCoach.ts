import { useState, useCallback } from 'react';
import { coachRepository } from '../../../core/database/repositorios/coachRepository';
import { evaluarNuevoGasto, evaluarRachaAbstinencia, MensajeCoach } from '../utils/evaluadorReglas';
import { useAuth } from '../../../core/contexts/AuthContext';

export const useCoach = () => {
  const { usuario } = useAuth();
  const [feedback, setFeedback] = useState<MensajeCoach | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  /**
   * Evalúa un gasto justo antes o después de ser insertado
   * @param montoGasto Monto a gastar
   * @param bloqueId Opcional, si pertenece a un bolsillo
   */
  const revisarImpactoDeGasto = useCallback(async (montoGasto: number, bloqueId?: number) => {
    if (!usuario?.id) return;

    try {
      const metricasMes = await coachRepository.obtenerMetricasDelMes(usuario.id);
      
      // Consideramos "gastos pequeños" aquellos menores a $15.000 para esta regla (podría ser dinámico)
      const maxGastoHormiga = 15000;
      let conteoPequenos = 0;
      if (montoGasto < maxGastoHormiga) {
        // En los últimos 7 días
        conteoPequenos = await coachRepository.obtenerConteoGastosPequenosRecientes(usuario.id, maxGastoHormiga, 7);
      }
      
      let bloquePresupuesto = 0;
      let bloqueGastado = 0;
      if (bloqueId) {
        const estadoBloque = await coachRepository.obtenerEstadoBloque(bloqueId);
        bloquePresupuesto = estadoBloque.presupuesto;
        bloqueGastado = estadoBloque.gastado;
      }

      const metricas = {
        totalIngresosMesp: metricasMes.totalIngresos,
        totalGastosMesp: metricasMes.totalGastos,
        conteoGastosPequenos: conteoPequenos,
        diasSinGastar: 0, // No aplica en el disparo por gasto
        bloquePresupuesto,
        bloqueGastado
      };

      const resultado = evaluarNuevoGasto(montoGasto, metricas);
      
      if (resultado) {
        setFeedback(resultado);
        setIsVisible(true);
      }
      return resultado;
    } catch (error) {
      console.error('Error al revisar impacto de gasto (Coach):', error);
      return null;
    }
  }, [usuario?.id]);

  /**
   * Se puede llamar al abrir la app para ver si el usuario lleva días sin gastar
   */
  const revisarAbstinencia = useCallback(async () => {
    if (!usuario?.id) return;
    try {
      const diasGastar = await coachRepository.obtenerDiasSinGastar(usuario.id);
      const resultado = evaluarRachaAbstinencia(diasGastar);
      
      if (resultado) {
        setFeedback(resultado);
        setIsVisible(true);
      }
    } catch (error) {
      console.error('Error al revisar abstinencia (Coach)', error);
    }
  }, [usuario?.id]);

  const cerrarCoach = useCallback(() => {
    setIsVisible(false);
    // Timeout para vaciar el estado luego de la animación del modal
    setTimeout(() => {
      setFeedback(null);
    }, 400);
  }, []);

  return { 
    feedback, 
    isVisible,
    revisarImpactoDeGasto, 
    revisarAbstinencia,
    cerrarCoach 
  };
};
