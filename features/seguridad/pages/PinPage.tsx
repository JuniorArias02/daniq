import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Keyboard, Pressable } from 'react-native';
import { ArrowLeft, AlertTriangle, Eye, EyeOff, Keyboard as KeyboardIcon, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import BaseLayout from '../../../core/layouts/BaseLayout';
import { useTheme } from '../../../core/contexts/ThemeContext';
import { useSeguridad } from '../hooks/useSeguridad';

const PinBox = ({ idx, pin, mostrarPin, isDarkMode, textMain }: any) => {
  const isActive = pin.length === idx;
  const isFilled = pin.length > idx;
  
  // Colores limpios y consistentes sin opacidades raras
  const cardColor = isDarkMode ? '#1E293B' : '#FFFFFF';
  const borderColor = isActive ? '#6366F1' : isDarkMode ? '#334155' : '#E2E8F0';
  const bgColor = isActive ? (isDarkMode ? '#0F172A' : '#EEF2FF') : cardColor;
  const dotColor = isActive ? '#6366F1' : isDarkMode ? '#334155' : '#CBD5E1';

  return (
    <View 
       style={{
          width: 65, height: 80, borderRadius: 20, borderWidth: isActive ? 2 : 1, 
          alignItems: 'center', justifyContent: 'center',
          borderColor: borderColor, backgroundColor: bgColor,
       }}
    >
      {isFilled ? (
          <Text style={{ fontSize: 32, fontWeight: '900', color: isDarkMode ? '#FFFFFF' : '#0F172A' }}>
            {mostrarPin ? pin.charAt(idx) : '●'}
          </Text>
      ) : (
          <View 
            style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: dotColor, opacity: isActive ? 1 : 0.5 }} 
          />
      )}
    </View>
  );
};

export default function PinPage() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { configurarPin } = useSeguridad();
  const inputRef = useRef<TextInput>(null);

  const [pin, setPin] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mostrarPin, setMostrarPin] = useState(false);

  const MAX_LENGTH = 4;

  const bgMain = isDarkMode ? 'bg-dark-bg' : 'bg-slate-50';
  const cardBg = isDarkMode ? 'bg-dark-card' : 'bg-white';
  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSub = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const borderCol = isDarkMode ? 'border-white/10' : 'border-slate-200';

  const handleGuardar = async (nuevoPin: string) => {
    if (nuevoPin.length < MAX_LENGTH) return;
    
    setEnviando(true);
    Keyboard.dismiss();
    
    try {
      await configurarPin(nuevoPin);
      Alert.alert(
        "PIN Establecido", 
        "Tu configuración de seguridad ha sido actualizada.",
        [{ text: "Entendido", onPress: () => router.back() }]
      );
    } catch (e) {
      Alert.alert("Error", "No se pudo guardar el PIN.");
      setEnviando(false);
    }
  };

  const handlePinChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setPin(numericValue);
  };

  return (
    <BaseLayout>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} className={bgMain}>
        {/* Header */}
        <View className="px-6 pt-5 pb-4 mb-4">
           <TouchableOpacity 
             onPress={() => router.back()} 
             className={`w-11 h-11 ${cardBg} items-center justify-center rounded-2xl border ${borderCol} shadow-sm`}
           >
               <ArrowLeft size={22} color={isDarkMode ? "#F1F5F9" : "#0F172A"} strokeWidth={1.5} />
           </TouchableOpacity>
        </View>

        <View className="flex-1 px-8 items-center justify-center pb-20">
            <Text className={`${textMain} text-3xl font-black mb-2 text-center`}>Crea tu PIN</Text>
            <Text className={`text-slate-500 text-sm text-center mb-12 px-4`}>Ingresa 4 dígitos para proteger el acceso a tus finanzas.</Text>

            <View className="relative w-full mb-8">
              {/* Input gigante invisible que atrapa los toques encima de toda la capa de PinBox */}
              <TextInput
                ref={inputRef}
                value={pin}
                onChangeText={handlePinChange}
                maxLength={MAX_LENGTH}
                keyboardType="number-pad"
                autoFocus
                caretHidden
                style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', zIndex: 50, elevation: 50 }}
              />

              <View className="flex-row justify-between w-full px-2" pointerEvents="none">
                 <PinBox idx={0} pin={pin} mostrarPin={mostrarPin} isDarkMode={isDarkMode} cardBg={cardBg} textMain={textMain} borderCol={borderCol} />
                 <PinBox idx={1} pin={pin} mostrarPin={mostrarPin} isDarkMode={isDarkMode} cardBg={cardBg} textMain={textMain} borderCol={borderCol} />
                 <PinBox idx={2} pin={pin} mostrarPin={mostrarPin} isDarkMode={isDarkMode} cardBg={cardBg} textMain={textMain} borderCol={borderCol} />
                 <PinBox idx={3} pin={pin} mostrarPin={mostrarPin} isDarkMode={isDarkMode} cardBg={cardBg} textMain={textMain} borderCol={borderCol} />
              </View>
            </View>

            {/* Opciones debajo del PIN */}
            <View className="flex-row items-center justify-between w-full px-6 mb-12">
               <TouchableOpacity 
                  onPress={() => setMostrarPin(!mostrarPin)}
                  className={`flex-row items-center justify-center py-2 px-4 rounded-full ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}
               >
                  {mostrarPin ? <EyeOff size={16} color="#6366F1" className="mr-2" /> : <Eye size={16} color="#6366F1" className="mr-2" />}
                  <Text className={`${textSub} text-[11px] font-bold`}>{mostrarPin ? 'Ocultar PIN' : 'Ver PIN'}</Text>
               </TouchableOpacity>

               <TouchableOpacity 
                  onPress={() => inputRef.current?.focus()}
                  className={`flex-row items-center justify-center py-2 px-4 rounded-full ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}
               >
                  <KeyboardIcon size={16} color="#475569" className="mr-2" />
                  <Text className={`${textSub} text-[11px] font-bold`}>Abrir Teclado</Text>
               </TouchableOpacity>
            </View>

            {/* Advertencia Peligro Estilo Premium */}
            <View className={`w-full bg-red-500/10 border border-red-500/20 rounded-[30px] p-6 flex-row items-center`}>
               <View className="w-12 h-12 rounded-full bg-red-500/20 items-center justify-center mr-4">
                  <AlertTriangle size={24} color="#EF4444" />
               </View>
               <View className="flex-1 pr-2">
                 <Text className="text-red-500 font-black mb-1">Cuidado al olvidarlo</Text>
                 <Text className="text-red-400/80 text-[11px] leading-4">
                    Recuerda que si llegas a olvidar la clave no podrás recuperar nada. Se hará un borrado completo de tus registros ya que Daniq no cuenta con recuperación en la nube por tú privacidad.
                 </Text>
               </View>
            </View>

        </View>

        {/* Boton Flotante Guardar Clave */}
        {pin.length === MAX_LENGTH && (
          <View className="absolute bottom-10 right-6 animate-fade-in">
             <TouchableOpacity 
               onPress={() => handleGuardar(pin)}
               className="bg-indigo-500 h-14 pl-6 pr-4 rounded-full flex-row items-center shadow-lg shadow-indigo-500/30"
               disabled={enviando}
             >
                <Text className="text-white font-black text-sm uppercase tracking-wider mr-2">{enviando ? 'Guardando...' : 'Guardar Clave'}</Text>
                <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
                  <Check size={16} color="white" strokeWidth={3} />
                </View>
             </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </BaseLayout>
  );
}
