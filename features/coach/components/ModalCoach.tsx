import { BlurView } from 'expo-blur';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import Modal from 'react-native-modal';
import { useTheme } from '../../../core/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';
import { AlertTriangle, Info, Trophy } from 'lucide-react-native';
import { MensajeCoach } from '../utils/evaluadorReglas';

interface ModalCoachProps {
  visible: boolean;
  onClose: () => void;
  feedback: MensajeCoach | null;
  onModalWillShow?: () => void;
  onModalHide?: () => void;
}

export default function ModalCoach({ visible, onClose, feedback, onModalWillShow, onModalHide }: ModalCoachProps) {
  const { isDarkMode } = useTheme();
  const { width, height } = useWindowDimensions();

  if (!feedback) return null;

  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSub = isDarkMode ? 'text-slate-300' : 'text-slate-500';

  let config = { 
    icon: Info, color: '#3b82f6', bgIcon: 'bg-blue-500/20', 
    bgCard: isDarkMode ? 'bg-slate-900 border-blue-500/50' : 'bg-white border-blue-200' 
  };
  
  if (feedback.tipo === 'regaño') {
    config = { 
        icon: AlertTriangle, color: '#ef4444', bgIcon: 'bg-red-500/20', 
        bgCard: isDarkMode ? 'bg-[#1c0f0f] border-red-500/50' : 'bg-red-50 border-red-200' 
    };
  } else if (feedback.tipo === 'felicitacion') {
    config = { 
        icon: Trophy, color: '#22c55e', bgIcon: 'bg-green-500/20', 
        bgCard: isDarkMode ? 'bg-[#0f1c13] border-green-500/50' : 'bg-green-50 border-green-200' 
    };
  } else if (feedback.tipo === 'alerta') {
    config = { 
        icon: Info, color: '#f59e0b', bgIcon: 'bg-amber-500/20', 
        bgCard: isDarkMode ? 'bg-[#1c160f] border-amber-500/50' : 'bg-amber-50 border-amber-200' 
    };
  }

  const IconComponent = config.icon;

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={['down']}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={400}
      animationOutTiming={400}
      backdropOpacity={0}
      style={{ margin: 0, justifyContent: 'flex-end', zIndex: 9999 }}
      onModalWillShow={onModalWillShow}
      onModalHide={onModalHide}
      customBackdrop={
        <View style={{ width, height }}>
          <BlurView
            intensity={30}
            tint={isDarkMode ? 'dark' : 'light'}
            style={[StyleSheet.absoluteFill, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.5)' }]}
          />
          <TouchableWithoutFeedback onPress={onClose}>
              <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
        </View>
      }
      onModalShow={() => {
        if (feedback.tipo === 'regaño') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } else if (feedback.tipo === 'felicitacion') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      }}
    >
      <View className="px-5 pb-[50px]">
        {/* El contorno brillante */}
        <View className={`${config.bgCard} rounded-[32px] p-7 border-2 shadow-2xl`}>
          <View className="flex-row items-center mb-4">
            <View className={`w-14 h-14 rounded-full items-center justify-center mr-4 ${config.bgIcon}`}>
              <IconComponent size={28} color={config.color} />
            </View>
            <View className="flex-1">
              <Text className={`${textSub} text-[10px] font-bold uppercase tracking-[3px] mb-1`}>
                Tu Alter Ego Financiero
              </Text>
              <Text style={{ color: config.color }} className="text-xl font-black uppercase tracking-tight">
                {feedback.tipo === 'regaño' ? '¡Alerta!' : feedback.tipo === 'felicitacion' ? '¡Bien hecho!' : 'Atención'}
              </Text>
            </View>
          </View>
          
          <Text className={`${textMain} text-[17px] font-medium leading-7 tracking-wide`}>
            "{feedback.mensaje}"
          </Text>
          
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.8}
            style={{ backgroundColor: config.color }}
            className={`w-full items-center py-4 mt-8 rounded-[20px] shadow-lg`}
          >
            <Text className="text-white font-black text-[15px] uppercase tracking-widest">
              Entendido
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
