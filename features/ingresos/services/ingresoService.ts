import { ingresoRepository } from '../../../core/database/repositorios/ingresoRepository';

/**
 * ingresoService: Orquestador de obtención y entrega de ingresos.
 */

export async function registrarIngreso(usuario_id: number, monto: number, descripcion: string) {
  if (monto <= 0) throw new Error("El ingreso debe ser una cifra positiva");
  if (!descripcion || descripcion.trim().length === 0) throw new Error("Dale un nombre al ingreso (ej: Sueldo de Marzo)");

  const fechaActual = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  return await ingresoRepository.crear(usuario_id, monto, descripcion, fechaActual);
}

export async function obtenerTotalIngresos(usuario_id: number) {
  return await ingresoRepository.obtenerTotalAcumulado(usuario_id);
}
