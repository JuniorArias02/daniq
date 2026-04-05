import * as SQLite from 'expo-sqlite';
import { setupDatabase } from './schema';

/**
 * database/index.ts: Motor central de base de datos
 * Singleton pattern para evitar múltiples aperturas simultáneas en Android.
 */

const DB_NAME = 'daniq.db';
let dbInstance: SQLite.SQLiteDatabase | null = null;
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * getDB: Singleton robusto con bloqueo de inicialización (Race-Condition-Proof)
 */
export const getDB = async () => {
  // Si ya hay una instancia lista, regresamos de inmediato
  if (dbInstance) return dbInstance;

  // Si hay una inicialización en progreso, la esperamos
  if (dbPromise) return dbPromise;

  // Si no, arrancamos la inicialización y guardamos la promesa
  dbPromise = (async () => {
    try {
      const db = await SQLite.openDatabaseAsync(DB_NAME);
      
      // 1. Configuramos la sesión (paso independiente para evitar NPE en Android)
      await db.execAsync('PRAGMA foreign_keys = ON;');
      
      // 2. Garantizamos que el esquema base esté creado
      await db.execAsync(setupDatabase);
      
      dbInstance = db;
      return db;
    } catch (err) {
      dbPromise = null; // Si falla, permitimos reintentar en la próxima llamada
      throw err;
    }
  })();

  return dbPromise;
};

/**
 * Ejecuta una consulta que devuelve un solo resultado.
 */
export async function fetchFirst<T>(sql: string, params: any[] = []): Promise<T | null> {
  try {
    const db = await getDB();
    return await db.getFirstAsync<T>(sql, params);
  } catch (error) {
    console.error(`DB Error (fetchFirst) en SQL: ${sql}`, error);
    return null;
  }
}

/**
 * Ejecuta una consulta que devuelve una lista de resultados.
 */
export async function fetchAll<T>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const db = await getDB();
    return await db.getAllAsync<T>(sql, params);
  } catch (error) {
    console.error(`DB Error (fetchAll) en SQL: ${sql}`, error);
    return [];
  }
}

/**
 * Ejecuta operaciones de escritura (INSERT, UPDATE, DELETE).
 * Devuelve el ID generado o el número de filas afectadas.
 */
export async function execute(sql: string, params: any[] = []) {
  try {
    const db = await getDB();
    return await db.runAsync(sql, params);
  } catch (error) {
    console.error(`DB Error (execute) en SQL: ${sql}`, error);
    throw error;
  }
}
