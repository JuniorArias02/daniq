import React from 'react';
import { View, Text } from 'react-native';
import { Check } from 'lucide-react-native';
import Modal from 'react-native-modal';
import { useTheme } from '../../core/contexts/ThemeContext';

interface ModalExitoProps {
  visible: boolean;
  titulo: string;
  subtitulo?: string;
}

/**
 * ModalExito: Un modal minimalista y elegante para confirmar acciones exitosas.
 * No cubre toda la pantalla de forma agresiva.
 */
export default function ModalExito({ visible, titulo, subtitulo = "Daniq Premium" }: ModalExitoProps) {
  const { isDarkMode } = useTheme();

  return (
    <Modal 
      isVisible={visible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropOpacity={0.3}
      backdropTransitionOutTiming={0}
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
