import { movimientoRepository } from '../../../core/database/repositorios/movimientoRepository';

/**
 * movimientoService: Orquestador del flujo de historial de movimientos.
 */

export async function obtenerHistorialMovimientos(usuario_id: number) {
  if (!usuario_id) throw new Error("ID de usuario es requerido para obtener movimientos.");
  
  return await movimientoRepository.obtenerTodos(usuario_id);
}
