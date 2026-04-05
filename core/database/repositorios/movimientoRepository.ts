import { fetchAll } from '../index';

/**
 * movimientoRepository: Operaciones relacionadas con el historial general de movimientos
 * Combina ingresos y gastos en una sola vista.
 */

export const movimientoRepository = {
  /**
   * Obtiene la historia completa de ingresos y gastos de un usuario.
   */
  obtenerTodos: async (usuario_id: number) => {
    const sql = `
      SELECT 
        'gasto' as tipo_movimiento,
        g.id,
        g.monto,
        g.descripcion,
        g.fecha,
        g.created_at,
        b.nombre as bloque_nombre,
        b.color as bloque_color,
        c.nombre as categoria_nombre,
        c.icono as categoria_icono
      FROM gastos g
      LEFT JOIN bloques b ON g.bloque_id = b.id
      LEFT JOIN categorias c ON g.categoria_id = c.id
      WHERE g.usuario_id = ?
      
      UNION ALL
      
      SELECT 
        'ingreso' as tipo_movimiento,
        i.id,
        i.monto,
        i.descripcion,
        i.fecha,
        i.created_at,
        'Ingreso General' as bloque_nombre,
        '#22C55E' as bloque_color,
        NULL as categoria_nombre,
        NULL as categoria_icono
      FROM ingresos i
      WHERE i.usuario_id = ?
      
      ORDER BY fecha DESC, created_at DESC
    `;
    return await fetchAll<any>(sql, [usuario_id, usuario_id]);
  }
};
