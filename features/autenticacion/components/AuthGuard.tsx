import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuthGuard } from '../hooks/useAuthGuard';
import PantallaDesbloqueo from './PantallaDesbloqueo';
import { useTheme } from '../../../core/contexts/ThemeContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Componente Wrapper que bloquea el árbol de renderizado de la app
 * cuando el modo de seguridad lo exige.
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const { isChecking, isLocked, authMode, desbloquearPin, desbloquearContrasena } = useAuthGuard();
  const { isDarkMode } = useTheme();

  if (isChecking) {
     return (
       <View className={`flex-1 items-center justify-center ${isDarkMode ? 'bg-dark-bg' : 'bg-white'}`}>
         <ActivityIndicator size="large" color="#6366F1" />
       </View>
     );
  }

  // Si está bloqueada, PUNTOS DE ENTRADA CERRADOS, la UI secundaria se muestra y la principal se esconde abajo o se desmonta
  if (isLocked && authMode !== 'ninguno') {
    return (
       <>
         <View style={{ display: 'none' }}>
            {children}
         </View>
         <PantallaDesbloqueo 
            authMode={authMode} 
            onValidarPin={desbloquearPin} 
            onValidarPass={desbloquearContrasena} 
         />
       </>
    );
  }

  return <>{children}</>;
}
