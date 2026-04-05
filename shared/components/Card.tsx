import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';

import { useTheme } from '../../core/contexts/ThemeContext';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'flat';
}

/**
 * Card: Optimizada con estilos nativos para evitar el loop infinito de nativewind v4
 * durante cambios de tema.
 */
export default function Card({ 
  children, 
  className = "", 
  variant = 'default',
  style,
  ...props 
}: CardProps) {
  const { isDarkMode } = useTheme();

  const isFlat = variant === 'flat';
  
  // Estilos nativos para máxima estabilidad durante el switch de tema
  const themeStyles = StyleSheet.create({
    container: {
      backgroundColor: isDarkMode 
        ? (isFlat ? 'rgba(21, 25, 28, 0.5)' : '#15191C') 
        : '#FFFFFF',
      borderColor: isDarkMode 
        ? 'rgba(48, 54, 61, 0.4)' 
        : '#F1F5F9',
      borderWidth: 1,
      borderRadius: isFlat ? 16 : 24,
      // Sombra premium controlada nativamente
      elevation: isDarkMode ? 0 : (isFlat ? 2 : 6),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDarkMode ? 0 : 0.05,
      shadowRadius: 10,
    }
  });

  return (
    <View 
      style={[themeStyles.container, style]}
      className={`p-6 ${className}`} 
      {...props}
    >
      {children}
    </View>
  );
}
