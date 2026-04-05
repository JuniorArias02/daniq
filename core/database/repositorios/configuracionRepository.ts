import { fetchFirst, execute } from '../index';

/**
 * configuracionRepository: Capa de persistencia para las preferencias del usuario.
 */
export const configuracionRepository = {
  /**
   * Obtiene la configuración del usuario. 
   * Si no existe, la crea con valores por defecto.
   */
  obtenerConfiguracion: async (usuarioId: number) => {
    let config = await fetchFirst<any>(`SELECT * FROM configuracion WHERE usuario_id = ?`, [usuarioId]);
    
    if (!config) {
      await execute(
        `INSERT INTO configuracion (usuario_id, modo_oscuro, notificaciones) VALUES (?, 1, 1)`,
        [usuarioId]
      );
      config = await fetchFirst<any>(`SELECT * FROM configuracion WHERE usuario_id = ?`, [usuarioId]);
    }
    
    return config;
  },

  /**
   * Actualiza el modo oscuro.
   */
  actualizarModoOscuro: async (usuarioId: number, estado: boolean) => {
    return await execute(
      `UPDATE configuracion SET modo_oscuro = ?, updated_at = CURRENT_TIMESTAMP WHERE usuario_id = ?`,
      [estado ? 1 : 0, usuarioId]
    );
  },

  /**
   * Actualiza las notificaciones.
   */
  actualizarNotificaciones: async (usuarioId: number, estado: boolean) => {
    return await execute(
      `UPDATE configuracion SET notificaciones = ?, updated_at = CURRENT_TIMESTAMP WHERE usuario_id = ?`,
      [estado ? 1 : 0, usuarioId]
    );
  }
};
