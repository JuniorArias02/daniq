import { itemBloqueRepository } from '../../../core/database/repositorios/itemBloqueRepository';

/**
 * itemBloqueService: Lógica para el "Presupuesto Planificado" de cada bolsillo.
 */
export const itemBloqueService = {
    /**
     * Lista todos los items (metas de ahorro) de un bolsillo.
     */
    listarPorBloque: async (bloque_id: number) => {
        return await itemBloqueRepository.obtenerPorBloque(bloque_id);
    },

    /**
     * Agrega un nuevo gasto planificado (Meta) a un bolsillo.
     */
    agregarItem: async (bloque_id: number, nombre: string, precio: number) => {
        if (!nombre || nombre.trim().length === 0) throw new Error("Nombre inválido");
        if (precio <= 0) throw new Error("El precio debe ser mayor a cero");
        return await itemBloqueRepository.crear(bloque_id, nombre, precio);
    },

    /**
     * Elimina un item de la planificación.
     */
    eliminarItem: async (id: number) => {
        return await itemBloqueRepository.eliminar(id);
    }
};
