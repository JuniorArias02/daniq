import { usuarioRepository } from '../../../core/database/repositorios/usuarioRepository';

/**
 * usuarioService: Orquestador de lógica para el dominio Usuario.
 * Este archivo NO contiene SQL ni conoce los detalles de la BD.
 */

export async function obtenerUsuarioPrincipal() {
  return await usuarioRepository.buscarPrincipal();
}

export async function registrarNuevoUsuario(nombre: string) {
  if (!nombre || nombre.length < 2) {
    throw new Error("El nombre es demasiado corto");
  }
  
  return await usuarioRepository.crear(nombre);
}

export async function actualizarPerfil(id: number, nombre: string, correo?: string, telefono?: string, foto_perfil?: string) {
  if (!nombre || nombre.length < 2) throw new Error("Nombre demasiado corto");
  if (correo && correo.length > 0 && !correo.includes('@')) throw new Error("Correo inválido");

  return await usuarioRepository.actualizar(id, nombre, correo, telefono, foto_perfil);
}

