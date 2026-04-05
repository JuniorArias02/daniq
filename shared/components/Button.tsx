import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, TouchableOpacityProps } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface ButtonProps extends TouchableOpacityProps {
  titulo?: string;
  Icono?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'fab' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Button: Componente versátil para botones del proyecto.
 * Soporta variantes primarias, secundarias, icono y FAB.
 */
export default function Button({ 
  titulo, 
  Icono, 
  variant = 'primary', 
  size = 'md',
  className = "",
  style,
  ...props 
}: ButtonProps) {
  
  // Estilo base para botones estándar
  if (variant === 'fab') {
    return (
      <TouchableOpacity 
        className={`absolute bottom-6 right-6 w-14 h-14 bg-brand rounded-full items-center justify-center shadow-lg ${className}`}
        style={[
          { elevation: 5, shadowColor: '#22C55E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
          style
        ]}
        {...props}
      >
        {Icono && <Icono size={32} color="#FFFFFF" strokeWidth={2.5} />}
      </TouchableOpacity>
    );
  }

  if (variant === 'icon') {
     return (
      <TouchableOpacity className={`p-1 ${className}`} {...props}>
        {Icono && <Icono size={26} color="#94A3B8" strokeWidth={1.5} />}
      </TouchableOpacity>
    );
  }

  const sizes = {
    sm: 'py-2 px-4 rounded-xl',
    md: 'py-4 px-6 rounded-2xl',
    lg: 'py-5 px-8 rounded-3xl',
  };

  const variants = {
    primary: 'bg-brand',
    secondary: 'bg-dark-card border border-dark-border/60',
  };

  const textColors = {
    primary: 'text-white font-bold',
    secondary: 'text-slate-200 font-medium',
  };

  return (
    <TouchableOpacity 
      className={`${variants[variant]} ${sizes[size]} flex-row items-center justify-center ${className}`}
      {...props}
    >
      {Icono && <Icono size={20} color={variant === 'primary' ? '#FFF' : '#94A3B8'} className="mr-2" />}
      {titulo && <Text className={textColors[variant]}>{titulo}</Text>}
    </TouchableOpacity>
  );
}
