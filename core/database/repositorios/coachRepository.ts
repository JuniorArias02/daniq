import { fetchAll, fetchFirst } from '../index';

export const coachRepository = {
  /**
   * Obtiene la suma total de ingresos y gastos del mes en curso.
   */
  obtenerMetricasDelMes: async (usuario_id: number) => {
    // Ingresos del mes actual
    const sqlIngresos = `
      SELECT SUM(monto) as total 
      FROM ingresos 
      WHERE usuario_id = ? AND strftime('%Y-%m', fecha) = strftime('%Y-%m', 'now', 'localtime')
    `;
    const rowIn = await fetchFirst<{ total: number }>(sqlIngresos, [usuario_id]);
    const totalIngresos = rowIn?.total || 0;

    // Gastos del mes actual
    const sqlGastos = `
      SELECT SUM(monto) as total 
      FROM gastos 
      WHERE usuario_id = ? AND strftime('%Y-%m', fecha) = strftime('%Y-%m', 'now', 'localtime')
    `;
    const rowGas = await fetchFirst<{ total: number }>(sqlGastos, [usuario_id]);
    const totalGastos = rowGas?.total || 0;

    return { totalIngresos, totalGastos };
  },

  /**
   * Obtiene la cantidad de veces que se ha registrado un gasto menor o igual a montoMax
   * en los últimos 'dias' días.
   */
  obtenerConteoGastosPequenosRecientes: async (usuario_id: number, montoMax: number, dias: number = 7) => {
    const sql = `
      SELECT COUNT(*) as cantidad
      FROM gastos
      WHERE usuario_id = ? 
        AND monto <= ? 
        AND date(fecha) >= date('now', '-' || ? || ' days', 'localtime')
    `;
    const row = await fetchFirst<{ cantidad: number }>(sql, [usuario_id, montoMax, dias]);
    return row?.cantidad || 0;
  },

  /**
   * Calcula cuántos días han pasado desde el último gasto registrado.
   */
  obtenerDiasSinGastar: async (usuario_id: number) => {
    const sql = `
      SELECT IFNULL(CAST(julianday('now', 'localtime') - julianday(MAX(fecha)) AS INTEGER), 0) as dias
      FROM gastos
      WHERE usuario_id = ?
    `;
    const row = await fetchFirst<{ dias: number }>(sql, [usuario_id]);
    return row?.dias || 0;
  },

  /**
   * Compara el límite/presupuesto de un bloque frente a lo que ya se le ha gastado.
   */
  obtenerEstadoBloque: async (bloque_id: number) => {
    const sql = `
      SELECT 
        b.total as presupuesto,
        (SELECT SUM(monto) FROM gastos WHERE bloque_id = b.id) as gastado
      FROM bloques b
      WHERE b.id = ?
    `;
    const row = await fetchFirst<{ presupuesto: number | null, gastado: number | null }>(sql, [bloque_id]);
    return {
      presupuesto: row?.presupuesto || 0,
      gastado: row?.gastado || 0
    };
  }
};
