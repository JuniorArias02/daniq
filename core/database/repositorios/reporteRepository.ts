import { fetchAll, fetchFirst } from '../index';

/**
 * reporteRepository: Consultas avanzadas para el tablero de reportes.
 * Extrae agregados por categorías, bolsillos y tiempo.
 */

export const reporteRepository = {
  /**
   * Resumen total de ingresos vs gastos (Balance).
   */
  obtenerBalanceGeneral: async (usuario_id: number) => {
    const sql = `
      SELECT 
        (SELECT SUM(monto) FROM ingresos WHERE usuario_id = ?) as total_ingresos,
        (SELECT SUM(monto) FROM gastos WHERE usuario_id = ?) as total_gastos
    `;
    return await fetchFirst<any>(sql, [usuario_id, usuario_id]);
  },

  /**
   * Distribución de gastos por categoría.
   */
  obtenerGastosPorCategoria: async (usuario_id: number) => {
    const sql = `
      SELECT 
        c.nombre as label, 
        c.color, 
        c.icono, 
        SUM(g.monto) as total
      FROM gastos g
      JOIN categorias c ON g.categoria_id = c.id
      WHERE g.usuario_id = ?
      GROUP BY c.id
      ORDER BY total DESC
    `;
    return await fetchAll<any>(sql, [usuario_id]);
  },

  /**
   * Gastos por bolsillo (Bolsillos).
   */
  obtenerGastosPorBolsillo: async (usuario_id: number) => {
    const sql = `
      SELECT 
        b.nombre as label, 
        b.color, 
        SUM(g.monto) as total
      FROM gastos g
      JOIN bloques b ON g.bloque_id = b.id
      WHERE g.usuario_id = ?
      GROUP BY b.id
      ORDER BY total DESC
    `;
    return await fetchAll<any>(sql, [usuario_id]);
  },

  /**
   * Histórico de ingresos por mes (últimos 6 meses).
   */
  obtenerFlujoMensual: async (usuario_id: number) => {
    const sql = `
      SELECT 
        strftime('%m', fecha) as mes, 
        SUM(monto) as total
      FROM ingresos
      WHERE usuario_id = ?
      GROUP BY strftime('%m', fecha)
      ORDER BY mes DESC
      LIMIT 6
    `;
    return await fetchAll<any>(sql, [usuario_id]);
  },

  /**
   * Obtiene los totales de ingresos y gastos agrupados por mes REAL (formato YYYY-MM).
   */
  obtenerTotalesMensuales: async (usuarioId: number) => {
    const sql = `
      SELECT 
        strftime('%Y-%m', fecha) as mes,
        SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END) as ingresos,
        SUM(CASE WHEN tipo = 'gasto' THEN monto ELSE 0 END) as gastos
      FROM (
        SELECT fecha, monto, 'ingreso' as tipo, usuario_id FROM ingresos
        UNION ALL
        SELECT fecha, monto, 'gasto' as tipo, usuario_id FROM gastos
      )
      WHERE usuario_id = ?
      GROUP BY mes
      ORDER BY mes ASC
      LIMIT 6
    `;
    return await fetchAll<any>(sql, [usuarioId]);
  },

  /**
   * Obtiene el acumulado del mes actual vs el anterior para indicadores de tendencia.
   */
  obtenerComparativaGastosMeses: async (usuarioId: number) => {
    const sql = `
      WITH TotalesMeses AS (
        SELECT 
          strftime('%Y-%m', fecha) as mes,
          SUM(monto) as total
        FROM gastos
        WHERE usuario_id = ?
        AND fecha >= date('now', 'start of month', '-2 month')
        GROUP BY mes
      )
      SELECT 
        (SELECT total FROM TotalesMeses WHERE mes = strftime('%Y-%m', 'now')) as actual,
        (SELECT total FROM TotalesMeses WHERE mes = strftime('%Y-%m', 'now', '-1 month')) as anterior
    `;
    return await fetchFirst<any>(sql, [usuarioId]);
  }
};
