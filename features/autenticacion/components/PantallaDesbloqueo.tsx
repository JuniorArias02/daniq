import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, ActivityIndicator, Pressable, Vibration } from 'react-native';
import { ShieldAlert, Check, EyeOff, Eye, AlertCircle } from 'lucide-react-native';
import { useTheme } from '../../../core/contexts/ThemeContext';

interface PantallaDesbloqueoProps {
  authMode: 'ninguno' | 'pin' | 'contrasena';
  onValidarPin: (pin: string) => Promise<boolean>;
  onValidarPass: (pass: string) => Promise<boolean>;
}

export default function PantallaDesbloqueo({ authMode, onValidarPin, onValidarPass }: PantallaDesbloqueoProps) {
  const { isDarkMode } = useTheme();
  
  const [inputValue, setInputValue] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  
  const inputRef = useRef<TextInput>(null);

  const bgMain = isDarkMode ? 'bg-dark-bg' : 'bg-slate-50';
  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSub = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  const manejarValidacion = async (valorOverride?: string) => {
    const valorParaValidar = typeof valorOverride === 'string' ? valorOverride : inputValue;
    if (!valorParaValidar) return;
    setCargando(true);
    Keyboard.dismiss();

    let exitoso = false;
    if (authMode === 'pin') {
      exitoso = await onValidarPin(valorParaValidar);
    } else {
      exitoso = await onValidarPass(valorParaValidar);
    }

    setCargando(false);

    if (!exitoso) {
      Vibration.vibrate([0, 150, 100, 150]); // Vibra doble para error
      setErrorVisible(true);
      setInputValue('');
      setTimeout(() => setErrorVisible(false), 2500);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const onChangeTextConfig = (text: string) => {
    setErrorVisible(false);
    if (authMode === 'pin') {
      const pinNum = text.replace(/[^0-9]/g, '');
      setInputValue(pinNum);
      if (pinNum.length === 4) {
        manejarValidacion(pinNum);
      }
    } else {
      setInputValue(text);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, zIndex: 9999, elevation: 9999, position: 'absolute', width: '100%', height: '100%' }} className={bgMain}>
       <View className="flex-1 items-center justify-center px-8 relative">
           
           <View className="w-24 h-24 rounded-full bg-indigo-500/10 items-center justify-center mb-8 border-[6px] border-indigo-500/20">
               <ShieldAlert size={40} color="#6366F1" />
           </View>
           
           <Text className={`${textMain} text-4xl font-black mb-3 tracking-tight`}>App Bloqueada</Text>
           <Text className={`${textSub} text-[13px] text-center px-4 mb-10 leading-5`}>
               {authMode === 'pin' 
                 ? 'Ingresa tu PIN de 4 dígitos para acceder a tus finanzas de manera segura.' 
                 : 'Ingresa tu contraseña alfa-numérica para poder continuar usando Daniq.'}
           </Text>

           {authMode === 'pin' && (
              <View className="relative w-full mb-8 items-center flex-col justify-center">
                <TextInput
                  ref={inputRef}
                  value={inputValue}
                  onChangeText={onChangeTextConfig}
                  maxLength={4}
                  keyboardType="number-pad"
                  autoFocus
                  caretHidden
                  style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', zIndex: 50, elevation: 50 }}
                />

                <View className="flex-row justify-center space-x-4 w-full" pointerEvents="none">
                    {[0, 1, 2, 3].map((idx) => {
                       const isFilled = inputValue.length > idx;
                       return (
                          <View 
                             key={`pin_${idx}`}
                             style={{
                                width: 65, height: 80, borderRadius: 20, borderWidth: inputValue.length === idx ? 2 : 1, 
                                alignItems: 'center', justifyContent: 'center',
                                borderColor: inputValue.length === idx ? '#6366F1' : isDarkMode ? '#334155' : '#E2E8F0', 
                                backgroundColor: inputValue.length === idx ? (isDarkMode ? '#0F172A' : '#EEF2FF') : (isDarkMode ? '#1E293B' : '#FFFFFF'),
                             }}
                             className="mx-1"
                          >
                            {isFilled ? (
                                <Text style={{ fontSize: 32, fontWeight: '900', color: isDarkMode ? '#FFFFFF' : '#0F172A' }}>●</Text>
                            ) : (
                                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: inputValue.length === idx ? '#6366F1' : isDarkMode ? '#334155' : '#CBD5E1', opacity: inputValue.length === idx ? 1 : 0.5 }} />
                            )}
                          </View>
                       )
                    })}
                </View>

                {cargando && (
                    <View className="mt-8 flex-row items-center justify-center">
                        <ActivityIndicator color={isDarkMode ? 'white' : '#6366F1'} size="large" />
                    </View>
                )}
              </View>
           )}

           {authMode === 'contrasena' && (
              <View className="w-full mb-8 mt-2 items-center">
                 <View className="w-full relative justify-center">
                   <TextInput
                      ref={inputRef}
                      autoFocus
                      secureTextEntry={!mostrarPassword}
                      value={inputValue}
                      onChangeText={onChangeTextConfig}
                      placeholder="Contraseña"
                      placeholderTextColor={isDarkMode ? "#484F58" : "#94A3B8"}
                      className={`text-xl font-bold py-5 pl-6 pr-14 ${textMain} ${isDarkMode ? 'bg-dark-card border-white/10' : 'bg-white border-slate-200 shadow-sm'} border rounded-[28px] w-full text-center`}
                   />
                   <TouchableOpacity 
                     onPress={() => setMostrarPassword(!mostrarPassword)}
                     className="absolute right-5 z-10 p-2"
                   >
                     {mostrarPassword ? <EyeOff size={22} color="#6366F1" /> : <Eye size={22} color="#94A3B8" />}
                   </TouchableOpacity>
                 </View>
              </View>
           )}

           {errorVisible && (
              <View className="absolute bottom-24 bg-red-500/10 border border-red-500/30 px-6 py-3 rounded-full flex-row items-center animate-pulse">
                <AlertCircle size={16} color="#EF4444" className="mr-2" />
                <Text className="text-red-500 font-bold text-[13px]">Credencial incorrecta. Intentalo de nuevo.</Text>
              </View>
           )}

           {/* Boton Flotante para Contraseña */}
           {authMode === 'contrasena' && inputValue.length >= 4 && (
               <View className="absolute bottom-10 right-6 animate-fade-in shadow-2xl">
                  <TouchableOpacity 
                    onPress={() => manejarValidacion()}
                    className="bg-indigo-500 h-14 pl-6 pr-4 rounded-full flex-row items-center shadow-lg shadow-indigo-500/30"
                    disabled={cargando}
                  >
                     {cargando ? (
                        <ActivityIndicator color="white" className="mr-2" />
                     ) : (
                        <Text className="text-white font-black text-sm uppercase tracking-wider mr-2">Desbloquear</Text>
                     )}
                     <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
                       <Check size={16} color="white" strokeWidth={3} />
                     </View>
                  </TouchableOpacity>
               </View>
           )}
       </View>
    </KeyboardAvoidingView>
  );
}
