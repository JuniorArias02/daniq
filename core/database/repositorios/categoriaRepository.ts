import { fetchAll, execute } from '../index';

/**
 * categoriaRepository: CRUD para las categorías globales (o personalizadas).
 */

export const categoriaRepository = {
  /**
   * Obtiene todas las categorías ordenadas por nombre.
   */
  obtenerTodas: async () => {
    const sql = 'SELECT * FROM categorias ORDER BY nombre ASC';
    return await fetchAll<any>(sql);
  },

  /**
   * Crea una nueva categoría.
   */
  crear: async (nombre: string, icono: string, color: string) => {
    const sql = 'INSERT INTO categorias (nombre, icono, color) VALUES (?, ?, ?)';
    const result = await execute(sql, [nombre, icono, color]);
    return result.lastInsertRowId;
  },

  /**
   * Elimina una categoría (Cuidado con los gastos asociados).
   */
  borrar: async (id: number) => {
    const sql = 'DELETE FROM categorias WHERE id = ?';
    return await execute(sql, [id]);
  }
};
