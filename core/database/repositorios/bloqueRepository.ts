import { fetchAll, fetchFirst, execute } from '../index';

/**
 * bloqueRepository: Capa de persistencia para los "Bloques" o "Bolsillos" de gasto.
 */

export const bloqueRepository = {
  /**
   * Obtiene todos los bloques del usuario, calculando el total gastado en cada uno.
   */
  obtenerTodos: async (usuario_id: number) => {
    const sql = `
      SELECT b.*, 
      (SELECT SUM(monto) FROM gastos WHERE bloque_id = b.id) as gastado 
      FROM bloques b 
      WHERE usuario_id = ?
      ORDER BY created_at DESC
    `;
    return await fetchAll<any>(sql, [usuario_id]);
  },

  /**
   * Obtiene un solo bloque con su sumatoria de gastos.
   */
  obtenerPorId: async (id: number) => {
    const sql = `
      SELECT b.*, 
      (SELECT SUM(monto) FROM gastos WHERE bloque_id = b.id) as gastado 
      FROM bloques b 
      WHERE id = ?
    `;
    return await fetchFirst<any>(sql, [id]);
  },

  /**
   * Crea un nuevo bloque de gasto (Ej: Plan Moto, Viaje).
   */
  crear: async (usuario_id: number, nombre: string, tipo: string, color?: string, imagen?: string) => {
    const sql = 'INSERT INTO bloques (usuario_id, nombre, tipo, color, imagen) VALUES (?, ?, ?, ?, ?)';
    const result = await execute(sql, [usuario_id, nombre, tipo, color, imagen]);
    return result.lastInsertRowId;
  },

  /**
   * Elimina un bloque y todos sus gastos asociados (gracias a ON DELETE CASCADE).
   */
  eliminar: async (id: number) => {
    const sql = 'DELETE FROM bloques WHERE id = ?';
    return await execute(sql, [id]);
  }
};
