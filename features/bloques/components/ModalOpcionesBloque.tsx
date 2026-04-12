import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Edit3, Trash2 } from 'lucide-react-native';
import Modal from 'react-native-modal';
import { useTheme } from '../../../core/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';

interface ModalOpcionesBloqueProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  nombreBloque: string;
  onModalWillShow?: () => void;
  onModalHide?: () => void;
}

/**
 * ModalOpcionesBloque: Menú contextual premium para editar o eliminar un bolsillo.
 * Pantalla completa con overlay semi-opaco via backdropOpacity de react-native-modal.
 */
export default function ModalOpcionesBloque({ visible, onClose, onEdit, onDelete, nombreBloque, onModalWillShow, onModalHide }: ModalOpcionesBloqueProps) {
  const { isDarkMode } = useTheme();

  const textMain = isDarkMode ? 'text-slate-100' : 'text-slate-900';
  const textSub = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const cardBg = isDarkMode ? 'bg-dark-card' : 'bg-white';
  const borderCol = isDarkMode ? 'border-white/5' : 'border-slate-200';

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={['down']}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationInTiming={250}
      animationOutTiming={250}
      backdropOpacity={0}
      style={{ margin: 0 }}
      onModalWillShow={onModalWillShow}
      onModalHide={onModalHide}
      onModalShow={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
    >
      {/* Panel centrado sobre el overlay */}
      <View className="flex-1 justify-center items-center px-8">

        {/* Tarjeta: nombre del bolsillo */}
        <View className={`w-full ${cardBg} rounded-3xl p-6 border ${borderCol} mb-4`}>
          <Text className={`${textSub} text-[10px] font-bold uppercase tracking-[3px] mb-1`}>
            Opciones del Bolsillo
          </Text>
          <Text className={`${textMain} text-2xl font-black tracking-tight`} numberOfLines={1}>
            {nombreBloque}
          </Text>
        </View>

        {/* Botón Editar */}
        <TouchableOpacity
          onPress={() => { onClose(); onEdit(); }}
          activeOpacity={0.8}
          className={`w-full flex-row items-center p-5 rounded-3xl border mb-3 ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'
            }`}
        >
          <View className="w-11 h-11 rounded-2xl bg-blue-500 items-center justify-center mr-4">
            <Edit3 size={20} color="#FFF" />
          </View>
          <View className="flex-1">
            <Text className={`${textMain} font-bold text-base`}>Editar Detalles</Text>
            <Text className={`${textSub} text-xs mt-0.5`}>Cambia el nombre, color o imagen</Text>
          </View>
        </TouchableOpacity>

        {/* Botón Eliminar */}
        <TouchableOpacity
          onPress={() => { onClose(); onDelete(); }}
          activeOpacity={0.8}
          className={`w-full flex-row items-center p-5 rounded-3xl border mb-6 ${isDarkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100'
            }`}
        >
          <View className="w-11 h-11 rounded-2xl bg-red-500 items-center justify-center mr-4">
            <Trash2 size={20} color="#FFF" />
          </View>
          <View className="flex-1">
            <Text className={`${textMain} font-bold text-base`}>Eliminar Bolsillo</Text>
            <Text className={`${textSub} text-xs mt-0.5`}>Borrar permanentemente este registro</Text>
          </View>
        </TouchableOpacity>

        {/* Cancelar */}
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.7}
          className={`w-full items-center py-4 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-black/5 border-slate-200'
            }`}
        >
          <Text className={`${textSub} font-bold text-[11px] uppercase tracking-[3px]`}>Cancelar</Text>
        </TouchableOpacity>

      </View>
    </Modal>
  );
}

