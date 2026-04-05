import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Edit3, Trash2, X } from 'lucide-react-native';
import Modal from 'react-native-modal';
import { useTheme } from '../../../core/contexts/ThemeContext';

interface ModalOpcionesBloqueProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  nombreBloque: string;
}

/**
 * ModalOpcionesBloque: Menú contextual premium para editar o eliminar un bolsillo.
 */
export default function ModalOpcionesBloque({ visible, onClose, onEdit, onDelete, nombreBloque }: ModalOpcionesBloqueProps) {
  const { isDarkMode } = useTheme();

  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSub = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const cardBg = isDarkMode ? 'bg-dark-card' : 'bg-white';
  const borderCol = isDarkMode ? 'border-dark-border/40' : 'border-slate-100';

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={['down']}
      style={{ margin: 0, justifyContent: 'flex-end' }}
      backdropOpacity={0.5}
    >
      <View className={`${cardBg} rounded-t-[40px] p-8 pb-12 border-t ${borderCol}`}>
        {/* Handle de arrastre */}
        <View className="items-center mb-6">
          <View className="w-12 h-1.5 rounded-full bg-slate-300/30" />
        </View>

        <View className="mb-8">
           <Text className={`${textSub} text-[10px] font-bold uppercase tracking-[3px] mb-1`}>Opciones del Bolsillo</Text>
           <Text className={`${textMain} text-2xl font-black tracking-tight`}>{nombreBloque}</Text>
        </View>

        <View className="space-y-4">
          {/* Opción Editar */}
          <TouchableOpacity 
            onPress={() => {
              onClose();
              onEdit();
            }}
            className={`flex-row items-center p-5 rounded-2xl ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'} border mb-4`}
          >
            <View className="w-10 h-10 rounded-xl bg-blue-500 items-center justify-center mr-4">
               <Edit3 size={20} color="#FFF" />
            </View>
            <View>
                <Text className={`${textMain} font-bold text-lg`}>Editar Detalles</Text>
                <Text className={`${textSub} text-xs mt-0.5`}>Cambia el nombre, color o imagen</Text>
            </View>
          </TouchableOpacity>

          {/* Opción Eliminar */}
          <TouchableOpacity 
            onPress={() => {
              onClose();
              onDelete();
            }}
            className={`flex-row items-center p-5 rounded-2xl ${isDarkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100'} border`}
          >
            <View className="w-10 h-10 rounded-xl bg-red-500 items-center justify-center mr-4">
               <Trash2 size={20} color="#FFF" />
            </View>
            <View>
                <Text className={`${textMain} font-bold text-lg`}>Eliminar Bolsillo</Text>
                <Text className={`${textSub} text-xs mt-0.5`}>Borrar permanentemente este registro</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={onClose}
          className="mt-8 bg-slate-500/10 h-14 rounded-2xl items-center justify-center"
        >
          <Text className={`${textSub} font-bold uppercase tracking-widest text-xs`}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
