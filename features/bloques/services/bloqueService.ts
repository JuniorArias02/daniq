import { bloqueRepository } from '../../../core/database/repositorios/bloqueRepository';

/**
 * bloqueService: Orquestador del negocio de Bloques de Gasto
 */

export async function listarBloquesUsuario(usuario_id: number) {
  return await bloqueRepository.obtenerTodos(usuario_id);
}

export async function crearNuevoBloque(usuario_id: number, nombre: string, color: string = '#22C55E') {
  if (!nombre || nombre.length < 3) throw new Error("Dale un nombre más largo al bloque");
  
  // Por defecto el tipo es 'gasto' ya que así lo quiere el usuario (salidas)
  return await bloqueRepository.crear(usuario_id, nombre, 'gasto', color);
}

export async function borrarBloque(id: number) {
  return await bloqueRepository.eliminar(id);
}

export async function obtenerDetalleBloque(id: number) {
  return await bloqueRepository.obtenerPorId(id);
}
