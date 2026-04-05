import { categoriaRepository } from '../../../core/database/repositorios/categoriaRepository';

/**
 * categoriaService: Orquestador del flujo de negocio para las categorías.
 */

export async function listarCategorias() {
  let categories = await categoriaRepository.obtenerTodas();
  
  // Si no hay categorías, creamos unas por defecto para el usuario
  if (categories.length === 0) {
    const defaultCategories = [
      { nombre: 'Alimentación', icono: 'Utensils', color: '#EF4444' }, 
      { nombre: 'Antojos / Calle', icono: 'IceCream', color: '#FACC15' }, // Amarillo calle
      { nombre: 'Transporte', icono: 'Car', color: '#0EA5E9' },
      { nombre: 'Hogar', icono: 'Home', color: '#F59E0B' },
      { nombre: 'Salud', icono: 'Heart', color: '#10B981' },
      { nombre: 'Diversión', icono: 'Gamepad2', color: '#8B5CF6' },
      { nombre: 'Suscripciones', icono: 'PlayCircle', color: '#EC4899' },
      { nombre: 'Ropa / Moda', icono: 'Shirt', color: '#6366F1' },      // Indigo
      { nombre: 'Educación', icono: 'GraduationCap', color: '#A3E635' }, // Lima
      { nombre: 'Mascotas', icono: 'Dog', color: '#D4D4D8' },            // Gris claro
      { nombre: 'Regalos', icono: 'Gift', color: '#F43F5E' },           // Rosa fuerte
      { nombre: 'Gimnasio', icono: 'Dumbbell', color: '#475569' },      // Gris deporte
      { nombre: 'Belleza', icono: 'Sparkles', color: '#2DD4BF' },       // Turquesa
      { nombre: 'Ahorro', icono: 'TrendingUp', color: '#22C55E' },
      { nombre: 'Otros', icono: 'MoreHorizontal', color: '#64748B' },
    ];

    for (const cat of defaultCategories) {
      await categoriaRepository.crear(cat.nombre, cat.icono, cat.color);
    }
    
    categories = await categoriaRepository.obtenerTodas();
  }

  return categories;
}

export async function crearCategoria(nombre: string, icono: string, color: string) {
  if (nombre.trim().length === 0) throw new Error("El nombre de la categoría es obligatorio");
  
  return await categoriaRepository.crear(nombre, icono, color);
}

export async function eliminarCategoria(id: number) {
  return await categoriaRepository.borrar(id);
}
