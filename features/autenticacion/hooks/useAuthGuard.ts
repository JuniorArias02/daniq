import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { authService } from '../services/authService';
import { obtenerUsuarioPrincipal } from '../../usuario/services/usuarioService';

export function useAuthGuard() {
  const [isLocked, setIsLocked] = useState(false);
  const [authMode, setAuthMode] = useState<'ninguno' | 'pin' | 'contrasena'>('ninguno');
  const [isChecking, setIsChecking] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  
  const appState = useRef(AppState.currentState);
  const lockTimer = useRef<NodeJS.Timeout | null>(null);

  // Revisa el estado de la base de datos para saber si de antemano el usuario está bloqueado
  const chequearEstadoBloqueo = useCallback(async () => {
    setIsChecking(true);
    try {
      const u = await obtenerUsuarioPrincipal();
      if (!u) {
        setIsLocked(false);
        setIsChecking(false);
        return;
      }
      
      setUserId(u.id);
      const modo = await authService.obtenerModoBloqueo(u.id);
      setAuthMode(modo);
      
      if (modo !== 'ninguno') {
        setIsLocked(true);
      } else {
        setIsLocked(false);
      }
    } catch (e) {
      console.error("Error al chequear bloqueo de app:", e);
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Al montar la app arranca cerrado por seguridad natural
  useEffect(() => {
    chequearEstadoBloqueo();
  }, [chequearEstadoBloqueo]);

  // Manejar el App en Background y Foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      // De Activo a Background/Inactivo (El usuario sale a la homescreen)
      if (
        appState.current.match(/active/) &&
        (nextAppState === 'background' || nextAppState === 'inactive')
      ) {
         // Si tiene activado un modo de seguridad, bloqueamos la app preventivamente
         if (authMode !== 'ninguno') {
             setIsLocked(true);
         }
      }

      // De Background/Inactivo a Activo (El usuario vuelve a entrar a la app)
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
         // Re-validar contra DB siempre al volver a entrar
         chequearEstadoBloqueo();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [authMode, chequearEstadoBloqueo]);

  const desbloquearPin = async (pin: string): Promise<boolean> => {
    if (!userId) return false;
    const valido = await authService.validarPin(userId, pin);
    if (valido) setIsLocked(false);
    return valido;
  };

  const desbloquearContrasena = async (pass: string): Promise<boolean> => {
    if (!userId) return false;
    const valido = await authService.validarContrasena(userId, pass);
    if (valido) setIsLocked(false);
    return valido;
  };

  return {
    isChecking,
    isLocked,
    authMode,
    desbloquearPin,
    desbloquearContrasena,
    // Permite que la vista de configuración o creación de claves levante el bloqueo 
    // de manera forzada si se le necesita quitar algo.
    manualLockToggle: (state: boolean) => setIsLocked(state)
  };
}
