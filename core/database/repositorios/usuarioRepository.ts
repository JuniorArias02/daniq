import { fetchFirst, execute } from '../index';

/**
 * usuarioRepository: Capa de persistencia (SQL) para el dominio de Usuario.
 * Aquí viven las consultas CRUD puras.
 */

export const usuarioRepository = {
  /**
   * Busca al primer usuario registrado en la tabla.
   */
  buscarPrincipal: async () => {
    const sql = 'SELECT id, nombre, correo, telefono, foto_perfil FROM usuario LIMIT 1';
    return await fetchFirst<{ id: number; nombre: string; correo?: string; telefono?: string; foto_perfil?: string }>(sql);
  },

  /**
   * Registra un nuevo perfil de usuario.
   */
  crear: async (nombre: string) => {
    const sql = 'INSERT INTO usuario (nombre) VALUES (?)';
    return await execute(sql, [nombre]);
  },

  /**
   * Actualiza los datos de un usuario por su ID.
   */
  actualizar: async (id: number, nombre: string, correo?: string, telefono?: string, foto_perfil?: string) => {
    const sql = 'UPDATE usuario SET nombre = ?, correo = ?, telefono = ?, foto_perfil = ? WHERE id = ?';
    return await execute(sql, [nombre, correo, telefono, foto_perfil, id]);
  }
};
