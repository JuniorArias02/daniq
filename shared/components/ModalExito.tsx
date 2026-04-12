import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { Check } from 'lucide-react-native';
import Modal from 'react-native-modal';
import { useTheme } from '../../core/contexts/ThemeContext';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

interface ModalExitoProps {
  visible: boolean;
  titulo: string;
  subtitulo?: string;
}

/**
 * ModalExito: Un modal minimalista y elegante para confirmar acciones exitosas.
 * Ahora con el sistema estándar de difuminado (Blur).
 */
export default function ModalExito({ visible, titulo, subtitulo = "Daniq Premium" }: ModalExitoProps) {
  const { isDarkMode } = useTheme();
  const { width, height } = useWindowDimensions();

  return (
    <Modal 
      isVisible={visible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropOpacity={0}
      backdropTransitionOutTiming={0}
      onModalShow={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
      customBackdrop={
        <View style={{ width, height, backgroundColor: isDarkMode ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }}>
          <BlurView
            intensity={95}
            tint={isDarkMode ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
        </View>
      }
      className="m-0 items-center justify-center"
    >
      <View className={`${isDarkMode ? 'bg-dark-card border-white/5' : 'bg-white border-slate-100'} p-10 rounded-[50px] border shadow-2xl items-center w-64`}>
        <View className="bg-brand w-20 h-20 rounded-[30px] items-center justify-center shadow-lg shadow-brand/40 mb-6">
            <Check size={40} color="#000" strokeWidth={4} />
        </View>
        <Text className={`${isDarkMode ? 'text-white' : 'text-slate-900'} text-xl font-black text-center tracking-tight`}>{titulo}</Text>
        {subtitulo && (
            <Text className="text-brand text-[9px] font-bold uppercase tracking-[3px] mt-2 opacity-80 text-center">{subtitulo}</Text>
        )}
      </View>
    </Modal>
  );
}
