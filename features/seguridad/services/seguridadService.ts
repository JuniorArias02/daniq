import { seguridadRepository } from '../../../core/database/repositorios/seguridadRepository';

/**
 * Orquestador de negocio para el módulo de seguridad.
 */
export const seguridadService = {
  obtenerEstadoSeguridad: async (usuarioId: number) => {
    return await seguridadRepository.obtenerCredenciales(usuarioId);
  },

  guardarTipoSeguridad: async (
    usuarioId: number, 
    tipo: 'ninguno' | 'pin' | 'contrasena', 
    pin: string | null = null, 
    password: string | null = null
  ) => {
    await seguridadRepository.actualizarSeguridad(usuarioId, tipo, pin, password);
  }
};
