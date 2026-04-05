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
      
      // Borrón y cuenta nueva: Vaciamos las tablas (PLURAL) para no destruir el esquema
      await db.execAsync(`
        DELETE FROM gastos;
        DELETE FROM ingresos;
        DELETE FROM bloques;
        DELETE FROM items_bloque;
        DELETE FROM categorias;
        DELETE FROM configuracion;
        DELETE FROM usuario;
      `);

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
