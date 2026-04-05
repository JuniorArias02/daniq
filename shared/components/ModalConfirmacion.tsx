import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { AlertTriangle, Trash2, X } from 'lucide-react-native';
import { useTheme } from '../../core/contexts/ThemeContext';
import Button from './Button';

interface ModalConfirmacionProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  tipo?: 'danger' | 'warning' | 'info';
}

/**
 * ModalConfirmacion: Sustituto premium para Alert.alert
 */
export default function ModalConfirmacion({ 
  visible, 
  onClose, 
  onConfirm, 
  titulo, 
  mensaje, 
  textoConfirmar = "Eliminar",
  tipo = 'danger'
}: ModalConfirmacionProps) {
  const { isDarkMode } = useTheme();

  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSub = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-dark-bg' : 'bg-white';
  const borderCol = isDarkMode ? 'border-white/5' : 'border-slate-100';

  const colorIcon = tipo === 'danger' ? '#EF4444' : '#F59E0B';
  const bgIcon = tipo === 'danger' ? 'bg-red-500/10' : 'bg-amber-500/10';

  return (
    <Modal 
      isVisible={visible} 
      onBackdropPress={onClose}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropOpacity={0.5}
      useNativeDriver={true}
      className="items-center justify-center m-5"
    >
      <View className={`${cardBg} w-full p-8 rounded-[40px] border ${borderCol} items-center shadow-2xl`}>
        {/* Icono de Alerta */}
        <View className={`w-20 h-20 ${bgIcon} rounded-full items-center justify-center mb-6`}>
           {tipo === 'danger' ? <Trash2 size={36} color={colorIcon} /> : <AlertTriangle size={36} color={colorIcon} />}
        </View>

        <Text className={`${textMain} text-2xl font-black text-center mb-3 tracking-tighter`}>{titulo}</Text>
        <Text className={`${textSub} text-sm text-center leading-5 mb-8 px-4`}>{mensaje}</Text>

        <View className="flex-row w-full justify-between">
           <TouchableOpacity 
             onPress={onClose}
             className={`flex-1 h-14 ${isDarkMode ? 'bg-dark-card' : 'bg-slate-100'} rounded-2xl items-center justify-center mr-3 border ${borderCol}`}
           >
              <Text className={`${textMain} font-bold opacity-60`}>Cancelar</Text>
           </TouchableOpacity>

           <TouchableOpacity 
             onPress={() => {
                onConfirm();
                onClose();
             }}
             style={{ backgroundColor: colorIcon }}
             className="flex-1 h-14 rounded-2xl items-center justify-center shadow-lg"
           >
              <Text className="text-white font-bold">{textoConfirmar}</Text>
           </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
