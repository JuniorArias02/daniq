import { getDB } from '../database/index';
import { DevSettings } from 'react-native';

/**
 * sistemaService: Acciones críticas que afectan a toda la aplicación.
 */
export const sistemaService = {
  /**
   * Borrón y cuenta nueva: Vaciamos las tablas y reiniciamos.
   */
  resetearAplicacion: async (): Promise<void> => {
    try {
      const db = await getDB();
      
      // Destrucción total estructural: Hacemos DROP de todas las tablas para que las migraciones y esquemas nuevos surtan efecto
      await db.execAsync(`
        DROP TABLE IF EXISTS notificacion_logs;
        DROP TABLE IF EXISTS gastos;
        DROP TABLE IF EXISTS ingresos;
        DROP TABLE IF EXISTS presupuestos_mensuales;
        DROP TABLE IF EXISTS items_bloque;
        DROP TABLE IF EXISTS bloques;
        DROP TABLE IF EXISTS categorias;
        DROP TABLE IF EXISTS configuracion;
        DROP TABLE IF EXISTS usuario;
      `);

      // 2. Se obligará a la base de datos a recrearse en el siguiente fetchFirst/getDB
      // Pero mejor la recreamos de una vez llamando al schema importado
      const { setupDatabase } = require('../database/schema');
      await db.execAsync(setupDatabase);

      /* Comentado para evitar el aviso de Expo 'Loading from IP' 
         y permitir que la UI reaccione instantáneamente vía LayoutContent */
      // if (DevSettings) {
      //    DevSettings.reload();
      // }
    } catch (error) {
      console.error('Error al resetear la aplicación:', error);
      throw error;
    }
  },

  /**
   * Explora y hace log de todas las tablas en la consola de desarrollo.
   */
  explorarBaseDeDatos: async (): Promise<void> => {
    try {
      const db = await getDB();
      console.log('--- 🛡️ EXPLORANDO DATABASE DANIQ 🛡️ ---');
      
      const tablas = ['usuario', 'configuracion', 'gastos', 'ingresos', 'bloques', 'categorias', 'items_bloque'];
      
      for (const tabla of tablas) {
        const rows = await db.getAllAsync(`SELECT * FROM ${tabla}`);
        console.log(`\n📋 TABLA: ${tabla.toUpperCase()} [${rows.length} registros]`);
        if (rows.length > 0) {
          console.table(rows);
        } else {
          console.log(' (vacía)');
        }
      }
      
      console.log('\n--- 🍎 FIN DE EXPLORACIÓN 🍎 ---');
    } catch (err) {
      console.error('Error explorando base de datos:', err);
    }
  }
};
