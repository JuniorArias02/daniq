import { useEffect, useState } from 'react';
import { getDB } from '../database/index';
import { setupDatabase } from '../database/schema';

export function useDatabase() {
  const [isDbReady, setIsDbReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initDb() {
      try {
        const db = await getDB();
        // Ejecutar la configuración de la base de datos (tablas y relations)
        await db.execAsync(setupDatabase);

        // MIGRACIÓN MANUAL: Añadir foto_perfil si la tabla ya existía de antes
        try {
          await db.execAsync('ALTER TABLE usuario ADD COLUMN foto_perfil TEXT;');
        } catch (e) {
          // Ya existe el campo, nada que hacer
        }
        
        if (isMounted) {
          setIsDbReady(true);
        }
      } catch (e) {
        if (isMounted) {
          setError(e instanceof Error ? e : new Error(String(e)));
        }
        console.error("Error inicializando la base de datos", e);
      }
    }

    initDb();

    return () => {
      isMounted = false;
    };
  }, []);

  return { isDbReady, error };
}
