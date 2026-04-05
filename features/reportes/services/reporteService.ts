import { reporteRepository } from '../../../core/database/repositorios/reporteRepository';

/**
 * reporteService: Motor de análisis para la toma de decisiones.
 */

export async function obtenerResumenBalance(usuario_id: number) {
  const data = await reporteRepository.obtenerBalanceGeneral(usuario_id);
  const totalIngresos = data.total_ingresos || 0;
  const totalGastos = data.total_gastos || 0;
  const balance = totalIngresos - totalGastos;
  
  return {
    totalIngresos,
    totalGastos,
    balance
  };
}

export async function obtenerDistribucionCategorias(usuario_id: number) {
  return await reporteRepository.obtenerGastosPorCategoria(usuario_id);
}

export async function obtenerDistribucionBolsillos(usuario_id: number) {
  return await reporteRepository.obtenerGastosPorBolsillo(usuario_id);
}

export async function obtenerUltimosMovimientosMensuales(usuario_id: number) {
  return await reporteRepository.obtenerFlujoMensual(usuario_id);
}

export async function obtenerAnaliticaMensual(usuario_id: number) {
  return await reporteRepository.obtenerTotalesMensuales(usuario_id);
}

export async function obtenerTendenciaAhorro(usuario_id: number) {
  const data = await reporteRepository.obtenerComparativaGastosMeses(usuario_id);
  const actual = data?.actual || 0;
  const anterior = data?.anterior || 0;
  
  let diferenciaPercent = 0;
  if (anterior > 0) {
    diferenciaPercent = ((actual - anterior) / anterior) * 100;
  }

  return {
    actual,
    anterior,
    diferenciaPercent
  };
}
