import { fetchAll, fetchFirst, execute } from '../index';

/**
 * gastoRepository: Operaciones directas con la tabla 'gastos'.
 * Sigue el patrón limpio aislándolo de la lógica de negocio.
 */

export const gastoRepository = {
  /**
   * Registra un nuevo gasto asociado a un usuario, categoría y bloque específico.
   */
  crear: async (
    usuario_id: number, 
    monto: number, 
    descripcion: string, 
    fecha: string, 
    bloque_id: number,
    categoria_id?: number
  ) => {
    const sql = `
      INSERT INTO gastos (usuario_id, monto, descripcion, fecha, bloque_id, categoria_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await execute(sql, [usuario_id, monto, descripcion, fecha, bloque_id, categoria_id]);
    return result.lastInsertRowId;
  },

  /**
   * Obtiene los últimos gastos del usuario con información del bloque y categoría.
   */
  obtenerRecientes: async (usuario_id: number, limite: number = 10) => {
    const sql = `
      SELECT g.*, b.nombre as bloque_nombre, b.color as bloque_color, c.nombre as categoria_nombre, c.icono as categoria_icono
      FROM gastos g
      LEFT JOIN bloques b ON g.bloque_id = b.id
      LEFT JOIN categorias c ON g.categoria_id = c.id
      WHERE g.usuario_id = ?
      ORDER BY g.fecha DESC, g.id DESC
      LIMIT ?
    `;
    return await fetchAll<any>(sql, [usuario_id, limite]);
  },

  /**
   * Obtiene todos los gastos de un BLOQUE específico.
   */
  obtenerPorBloque: async (bloque_id: number) => {
    const sql = `
      SELECT g.*, c.nombre as categoria_nombre, c.icono as categoria_icono, c.color as categoria_color
      FROM gastos g
      LEFT JOIN categorias c ON g.categoria_id = c.id
      WHERE g.bloque_id = ?
      ORDER BY g.fecha DESC, g.id DESC
    `;
    return await fetchAll<any>(sql, [bloque_id]);
  },


  /**
   * Obtiene la sumatoria total de gastos históricos.
   */
  obtenerTotalAcumulado: async (usuario_id: number) => {
    const sql = 'SELECT SUM(monto) as total FROM gastos WHERE usuario_id = ?';
    const row = await fetchFirst<{ total: number }>(sql, [usuario_id]);
    return row?.total || 0;
  },

  /**
   * Elimina un gasto por su ID.
   */
  eliminar: async (gasto_id: number) => {
    const sql = 'DELETE FROM gastos WHERE id = ?';
    return await execute(sql, [gasto_id]);
  },

  /**
   * Actualiza un gasto existente.
   */
  actualizar: async (gasto_id: number, monto: number, descripcion: string, categoria_id?: number) => {
    const sql = `
      UPDATE gastos 
      SET monto = ?, descripcion = ?, categoria_id = ?
      WHERE id = ?
    `;
    return await execute(sql, [monto, descripcion, categoria_id, gasto_id]);
  }
};
