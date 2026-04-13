import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { ArrowLeft, Lock, ShieldCheck, Check, AlertTriangle, Eye, EyeOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import BaseLayout from '../../../core/layouts/BaseLayout';
import { useTheme } from '../../../core/contexts/ThemeContext';
import { useSeguridad } from '../hooks/useSeguridad';
import Button from '../../../shared/components/Button';

export default function ContrasenaPage() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { configurarPassword } = useSeguridad();

  const [password, setPassword] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const bgMain = isDarkMode ? 'bg-dark-bg' : 'bg-slate-50';
  const cardBg = isDarkMode ? 'bg-dark-card' : 'bg-white';
  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const borderCol = isDarkMode ? 'border-white/10' : 'border-slate-200';

  const handleGuardar = async () => {
    if (password.length < 4) {
      Alert.alert("Contraseña débil", "Por favor usa al menos 4 caracteres.");
      return;
    }
    
    setEnviando(true);
    Keyboard.dismiss();
    
    try {
      await configurarPassword(password);
      Alert.alert(
        "Clave Establecida", 
        "Caja fuerte asegurada con éxito.",
        [{ text: "Entendido", onPress: () => router.back() }]
      );
    } catch (e) {
      Alert.alert("Error", "No se pudo guardar la contraseña.");
      setEnviando(false);
    }
  };

  return (
    <BaseLayout>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} className={bgMain}>
        {/* Header */}
        <View className="px-6 pt-5 pb-4 mb-2 mt-2">
           <TouchableOpacity 
             onPress={() => router.back()} 
             className={`w-11 h-11 ${cardBg} items-center justify-center rounded-2xl border ${borderCol} shadow-sm`}
           >
               <ArrowLeft size={22} color={isDarkMode ? "#F1F5F9" : "#0F172A"} strokeWidth={1.5} />
           </TouchableOpacity>
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 px-8 items-center justify-center pb-20">
                <View className="mb-8 items-center">
                    <View className="w-20 h-20 rounded-[28px] bg-indigo-500/10 items-center justify-center border border-indigo-500/20 mb-6">
                        <Lock size={36} color="#6366F1" />
                    </View>
                    <Text className={`${textMain} text-3xl font-black mb-2 text-center tracking-tight`}>Crea tu Contraseña</Text>
                    <Text className={`text-slate-500 text-sm text-center px-4 leading-5`}>
                       Ingresa una contraseña fuerte, usando letras y números para mayor seguridad.
                    </Text>
                </View>

                <View className="w-full mb-8 relative justify-center">
                  <TextInput
                    autoFocus
                    secureTextEntry={!mostrarPassword}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Ej. MiDaniq123*"
                    placeholderTextColor={isDarkMode ? "#484F58" : "#94A3B8"}
                    className={`text-lg font-bold py-5 pl-6 pr-14 ${textMain} ${isDarkMode ? 'bg-dark-card border-white/10' : 'bg-white border-slate-200 shadow-sm'} border rounded-3xl w-full text-center`}
                  />
                  <TouchableOpacity 
                    onPress={() => setMostrarPassword(!mostrarPassword)}
                    className="absolute right-4 z-10 p-2"
                  >
                    {mostrarPassword ? <EyeOff size={22} color="#6366F1" /> : <Eye size={22} color="#94A3B8" />}
                  </TouchableOpacity>
                  
                  {password.length > 0 && password.length < 4 && (
                     <Text className="text-red-500 text-xs text-center mt-3 font-bold">Demasiado corta (min: 4)</Text>
                  )}
                  {password.length >= 4 && (
                     <Text className="text-indigo-500 text-xs text-center mt-3 font-bold">¡Todo listo para guardar!</Text>
                  )}
                </View>

               {/* Advertencia Peligro Estilo Premium */}
               <View className={`w-full bg-red-500/10 border border-red-500/20 rounded-[30px] p-6 flex-row items-center mb-10`}>
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
        </TouchableWithoutFeedback>

        {/* Boton Flotante Guardar Clave */}
        {password.length >= 4 && (
          <View className="absolute bottom-10 right-6 animate-fade-in shadow-2xl">
             <TouchableOpacity 
               onPress={handleGuardar}
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
