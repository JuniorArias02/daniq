import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { obtenerHistorialMovimientos } from './movimientoService';

/**
 * exportService: Maneja la generación de reportes en formato CSV
 * y su despacho a través del menú nativo de compartir.
 */

export async function exportarMovimientosCSV(usuario_id: number) {
  try {
    const movimientos = await obtenerHistorialMovimientos(usuario_id);
    
    if (!movimientos || movimientos.length === 0) {
      throw new Error("No hay movimientos registrados para exportar.");
    }

    // 1. Cabeceras del CSV
    // El orden: Fecha, Tipo, Descripción, Monto, Bloque, Categoría
    let csvString = "Fecha,Tipo,Descripcion,Monto,Bloque_Bolsillo,Categoria\n";

    // 2. Mapeo de datos
    movimientos.forEach(mov => {
      const fecha = mov.fecha || '';
      const tipo = mov.tipo_movimiento === 'ingreso' ? 'INGRESO' : 'GASTO';
      
      // Limpiamos comas para no romper las columnas del CSV
      const desc = (mov.descripcion || '').replace(/,/g, ' ');
      const monto = mov.monto || 0;
      const bloque = (mov.bloque_nombre || (mov.tipo_movimiento === 'ingreso' ? 'Ingreso General' : 'Sin Bloque')).replace(/,/g, ' ');
      const cat = (mov.categoria_nombre || '').replace(/,/g, ' ');

      csvString += `${fecha},${tipo},${desc},${monto},${bloque},${cat}\n`;
    });

    // 3. Crear nombre de archivo con timestamp
    const timestamp = new Date().getTime();
    const fileName = `Daniq_Movimientos_${timestamp}.csv`;
    
    // Acceso seguro mediante casting para evitar errores de lint si la versión es dispar
    const docDir = (FileSystem as any).documentDirectory || FileSystem.cacheDirectory || '';
    const fileUri = docDir + fileName;

    // 4. Escribir el archivo en el almacenamiento temporal del dispositivo
    // Usamos el string 'utf8' directamente para evitar problemas con las constantes de la librería
    await FileSystem.writeAsStringAsync(fileUri, csvString, {
      encoding: 'utf8',
    } as any);

    // 5. Verificar si se puede compartir
    const isSharingAvailable = await Sharing.isAvailableAsync();

    if (!isSharingAvailable) {
      throw new Error("La función de compartir no está disponible en este dispositivo.");
    }

    // 6. Lanzar el menú nativo de compartir
    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/csv',
      dialogTitle: 'Exportar Historial Daniq',
      UTI: 'public.comma-separated-values-text', // Para compatibilidad con iOS
    });

    return true;
  } catch (error) {
    console.error("Error en exportService:", error);
    throw error;
  }
}
