import React from 'react';
import { View, Text } from 'react-native';
import { Bot, AlertTriangle, Trophy, Info } from 'lucide-react-native';
import { useTheme } from '../../../core/contexts/ThemeContext';
import { MensajeCoach } from '../utils/evaluadorReglas';

interface CoachWidgetProps {
  mensajeObj: MensajeCoach | null;
}

export default function CoachWidget({ mensajeObj }: CoachWidgetProps) {
  const { isDarkMode } = useTheme();

  if (!mensajeObj) return null;

  // Configurar estilos según el tipo de mensaje (regaño, felicitacion, alerta, info)
  let bgColorClass = '';
  let borderColorClass = '';
  let textColor = '';
  let IconComponent = Bot;
  let iconColor = '';

  switch (mensajeObj.tipo) {
    case 'regaño':
      bgColorClass = 'bg-red-500/10';
      borderColorClass = 'border-red-500/30';
      textColor = 'text-red-500';
      IconComponent = AlertTriangle;
      iconColor = '#EF4444';
      break;
    case 'alerta':
      bgColorClass = 'bg-orange-500/10';
      borderColorClass = 'border-orange-500/30';
      textColor = 'text-orange-500';
      IconComponent = AlertTriangle;
      iconColor = '#F97316';
      break;
    case 'felicitacion':
      bgColorClass = 'bg-green-500/10';
      borderColorClass = 'border-green-500/30';
      textColor = 'text-green-500';
      IconComponent = Trophy;
      iconColor = '#22C55E';
      break;
    default:
    case 'info':
      bgColorClass = isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-50';
      borderColorClass = isDarkMode ? 'border-indigo-500/20' : 'border-indigo-200';
      textColor = 'text-indigo-500';
      IconComponent = Bot;
      iconColor = '#6366F1';
      break;
  }

  const textMain = isDarkMode ? 'text-slate-300' : 'text-slate-700';

  return (
    <View className={`w-full ${bgColorClass} border ${borderColorClass} rounded-3xl p-5 flex-row items-start mb-6`}>
      <View className="mr-4 mt-1">
        <View className={`w-10 h-10 rounded-full items-center justify-center`} style={{ backgroundColor: `${iconColor}20` }}>
          <IconComponent size={20} color={iconColor} />
        </View>
      </View>
      
      <View className="flex-1 pr-1">
        <Text className={`${textColor} font-black text-xs uppercase tracking-widest mb-1.5`}>Coach Financiero</Text>
        <Text className={`${textMain} font-semibold text-[13px] leading-5 italic`}>
          "{mensajeObj.mensaje}"
        </Text>
      </View>
    </View>
  );
}
