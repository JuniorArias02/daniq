import { gastoRepository } from '../../../core/database/repositorios/gastoRepository';

/**
 * gastoService: Orquestador del flujo de creación de gastos.
 * Valida montos y asociaciones antes de persistir.
 */

export async function registrarGasto(
    usuario_id: number, 
    monto: number, 
    descripcion: string, 
    bloque_id?: number | null,
    categoria_id?: number
) {
  // Validaciones de negocio
  if (monto <= 0) throw new Error("El monto debe ser mayor a cero");
  if (!descripcion || descripcion.trim().length === 0) throw new Error("Añade una descripción");

  const fechaActual = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

  return await gastoRepository.crear(
    usuario_id, 
    monto, 
    descripcion, 
    fechaActual, 
    bloque_id as any, 
    categoria_id
  );
}

export async function obtenerUltimosMovimientos(usuario_id: number) {
  return await gastoRepository.obtenerRecientes(usuario_id, 10);
}

export async function obtenerTotalGastos(usuario_id: number) {
  return await gastoRepository.obtenerTotalAcumulado(usuario_id);
}

export async function obtenerPorBloque(bloque_id: number) {
  return await gastoRepository.obtenerPorBloque(bloque_id);
}

export async function eliminarGasto(gasto_id: number) {
  return await gastoRepository.eliminar(gasto_id);
}

export async function editarGasto(gasto_id: number, monto: number, descripcion: string, categoria_id?: number) {
    if (monto <= 0) throw new Error("El monto debe ser mayor a cero");
    if (!descripcion || descripcion.trim().length === 0) throw new Error("Añade una descripción");

    return await gastoRepository.actualizar(gasto_id, monto, descripcion, categoria_id);
}
