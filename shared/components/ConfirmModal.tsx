import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { AlertTriangle } from 'lucide-react-native';

interface ConfirmModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'info';
}

/**
 * ConfirmModal: Modal de confirmación premium con react-native-modal.
 */
export default function ConfirmModal({
  isVisible,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger'
}: ConfirmModalProps) {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      useNativeDriver
      hideModalContentWhileAnimating
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropOpacity={0.8}
      backdropColor="#0D1117"
    >
      <View className="bg-dark-card border border-white/5 rounded-[32px] p-8 items-center">
        <View className={`w-16 h-16 rounded-full items-center justify-center mb-6 ${type === 'danger' ? 'bg-red-500/10' : 'bg-brand/10'}`}>
          <AlertTriangle size={32} color={type === 'danger' ? '#EF4444' : '#22C55E'} strokeWidth={1.5} />
        </View>

        <Text className="text-white text-xl font-bold text-center mb-2">{title}</Text>
        <Text className="text-slate-400 text-sm text-center leading-5 mb-8 px-2">{description}</Text>

        <View className="w-full space-y-4 mt-2">
          <TouchableOpacity 
            onPress={onConfirm}
            className={`w-full py-4 rounded-2xl items-center ${type === 'danger' ? 'bg-red-500' : 'bg-brand'}`}
          >
            <Text className="text-white font-bold">{confirmText}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
             onPress={onClose}
             className="w-full py-4 rounded-2xl items-center bg-white/10 border border-white/10"
          >
             <Text className="text-slate-300 font-bold">{cancelText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
