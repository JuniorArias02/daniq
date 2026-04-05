import { fetchAll, fetchFirst, execute } from '../index';

/**
 * ingresoRepository: Operaciones directas con la tabla de 'ingresos'.
 */

export const ingresoRepository = {
  /**
   * Registra una nueva entrada de dinero (Salarios, Freelance, Regalías...)
   */
  crear: async (usuario_id: number, monto: number, descripcion: string, fecha: string) => {
    const sql = 'INSERT INTO ingresos (usuario_id, monto, descripcion, fecha) VALUES (?, ?, ?, ?)';
    const result = await execute(sql, [usuario_id, monto, descripcion, fecha]);
    return result.lastInsertRowId;
  },

  /**
   * Obtiene la sumatoria total histórica de ingresos del usuario.
   */
  obtenerTotalAcumulado: async (usuario_id: number) => {
    const sql = 'SELECT SUM(monto) as total FROM ingresos WHERE usuario_id = ?';
    const row = await fetchFirst<{ total: number }>(sql, [usuario_id]);
    return row?.total || 0;
  }
};
