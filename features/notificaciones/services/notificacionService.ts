import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { MENSAJES_DANIQ } from '../constants/mensajes';
import { obtenerUsuarioPrincipal } from '../../usuario/services/usuarioService';
import { notificacionLogService } from './notificacionLogService';

/**
 * notificacionService: Motor de control de alertas Push locales.
 */
export const notificacionService = {

  /**
   * Pide permiso al sistema operativo (iOS/Android) para enviar notificaciones.
   */
  solicitarPermisos: async (): Promise<boolean> => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('daniq-default', {
        name: 'Alertas Daniq',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#22C55E',
      });
    }

    return true;
  },

  /**
   * Programa una secuencia de recordatorios diferentes para evitar repeticiones.
   */
  programarRecordatorios: async (intervalHours: number = 4): Promise<void> => {
    // 1. Limpiamos cualquier notificación vieja programada
    await Notifications.cancelAllScheduledNotificationsAsync();

    const user = await obtenerUsuarioPrincipal();
    const nombre = user?.nombre || 'Usuario';
    const intervalSeconds = 60 * 60 * intervalHours;

    // 2. Vamos a programar las próximas 3 notificaciones con mensajes distintos y ALEATORIOS (sin repetir recientes)
    for (let i = 0; i < 3; i++) {
        // Consultamos al cerebro de la app para una frase fresca
        const mc = await notificacionLogService.obtenerFraseDiferente();

        // Reemplazo dinámico de nombre
        const titulo = mc.titulo.replace('{{nombre}}', nombre);
        const body = mc.body.replace('{{nombre}}', nombre);

        await Notifications.scheduleNotificationAsync({
            content: {
                title: titulo,
                body: body,
                sound: true,
                priority: Notifications.AndroidNotificationPriority.MAX,
                data: { screen: 'Inicio' },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: (i + 1) * intervalSeconds, // La primera en 4h, la segunda en 8h...
                repeats: false, // Las programamos una a una para que el mensaje cambie
            },
        });

        // Guardamos en el log lo que vamos a decir para no repetirlo
        await notificacionLogService.registrarEnvio(mc.id);
    }
  },

  /**
   * Envía una notificación de prueba inmediata eligiendo un mensaje aleatorio.
   */
  enviarPruebaInmediata: async (): Promise<void> => {
    const user = await obtenerUsuarioPrincipal();
    const nombre = user?.nombre || 'Usuario';

    // Elegir uno al azar que NO sea de los recientes
    const mc = await notificacionLogService.obtenerFraseDiferente();

    // Reemplazo dinámico
    const titulo = mc.titulo.replace('{{nombre}}', nombre);
    const body = mc.body.replace('{{nombre}}', nombre);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: titulo,
        body: body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: null, // null significa disparo inmediato
    });

    // Guardamos en el log
    await notificacionLogService.registrarEnvio(mc.id);
  }
};

// Configuración moderna para SDK 54+
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, // Nuevo para Android/iOS
    shouldShowList: true, // Nuevo para Android/iOS
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
