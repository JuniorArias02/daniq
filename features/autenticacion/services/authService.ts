import { seguridadRepository } from '../../../core/database/repositorios/seguridadRepository';

export const authService = {
  /**
   * Obtiene el modo de seguridad actual del usuario para decidir si bloquear la app.
   */
  obtenerModoBloqueo: async (usuario_id: number): Promise<'ninguno' | 'pin' | 'contrasena'> => {
    try {
      const config = await seguridadRepository.obtenerCredenciales(usuario_id);
      if (!config || !config.tipo_seguridad) return 'ninguno';
      return config.tipo_seguridad as 'ninguno' | 'pin' | 'contrasena';
    } catch {
      return 'ninguno';
    }
  },

  /**
   * Valida el PIN proporcionado contra el guardado en base de datos.
   */
  validarPin: async (usuario_id: number, pinIngresado: string): Promise<boolean> => {
    try {
      const config = await seguridadRepository.obtenerCredenciales(usuario_id);
      if (config && config.tipo_seguridad === 'pin' && config.pin_seguridad === pinIngresado) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  /**
   * Valida la contraseña proporcionada.
   */
  validarContrasena: async (usuario_id: number, passIngresado: string): Promise<boolean> => {
    try {
      const config = await seguridadRepository.obtenerCredenciales(usuario_id);
      if (config && config.tipo_seguridad === 'contrasena' && config.contrasena_seguridad === passIngresado) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
};
