import { fetchFirst, execute } from '../index';

/**
 * seguridadRepository: Acceso a DB para contraseñas, PIN y gestión de seguridad local.
 */
export const seguridadRepository = {
  obtenerCredenciales: async (usuarioId: number) => {
    return await fetchFirst<{ tipo_seguridad: string, pin_seguridad: string, contrasena_seguridad: string }>(
      `SELECT tipo_seguridad, pin_seguridad, contrasena_seguridad FROM configuracion WHERE usuario_id = ?`,
      [usuarioId]
    );
  },
  
  actualizarSeguridad: async (usuarioId: number, tipo: string, pin: string | null, contrasena: string | null) => {
    return await execute(
      `UPDATE configuracion SET tipo_seguridad = ?, pin_seguridad = ?, contrasena_seguridad = ?, updated_at = CURRENT_TIMESTAMP WHERE usuario_id = ?`,
      [tipo, pin, contrasena, usuarioId]
    );
  }
};
