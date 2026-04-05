import { configuracionRepository } from '../../../core/database/repositorios/configuracionRepository';

/**
 * configuracionService: Dominio encargado de orquestar las preferencias del usuario.
 */

export async function obtenerPreferencias(usuarioId: number) {
  const data = await configuracionRepository.obtenerConfiguracion(usuarioId);
  return {
    modoOscuro: data?.modo_oscuro === 1,
    notificaciones: data?.notificaciones === 1
  };
}

export async function cambiarModoOscuro(usuarioId: number, estado: boolean) {
  return await configuracionRepository.actualizarModoOscuro(usuarioId, estado);
}

export async function cambiarNotificaciones(usuarioId: number, estado: boolean) {
  return await configuracionRepository.actualizarNotificaciones(usuarioId, estado);
}
