import { fetchAll, execute } from '../index';

/**
 * itemBloqueRepository: Persistencia para la lista de ítems (presupuesto planificado) dentro de un bolsillo.
 */
export const itemBloqueRepository = {
  /**
   * Obtiene todos los ítems planificados para un bloque específico.
   */
  obtenerPorBloque: async (bloque_id: number) => {
    const sql = 'SELECT * FROM items_bloque WHERE bloque_id = ? ORDER BY id DESC';
    return await fetchAll<any>(sql, [bloque_id]);
  },

  /**
   * Crea un nuevo ítem planificado.
   */
  crear: async (bloque_id: number, nombre: string, precio: number) => {
    const sql = 'INSERT INTO items_bloque (bloque_id, nombre, precio) VALUES (?, ?, ?)';
    const result = await execute(sql, [bloque_id, nombre, precio]);
    return result.lastInsertRowId;
  },

  /**
   * Elimina un ítem de la lista.
   */
  eliminar: async (id: number) => {
    const sql = 'DELETE FROM items_bloque WHERE id = ?';
    return await execute(sql, [id]);
  }
};
