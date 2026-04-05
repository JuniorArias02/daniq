import React, { useState, useRef } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Image, ScrollView, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { ShieldCheck, TrendingUp, Zap, Sparkles, ArrowRight, ChevronRight, Check } from 'lucide-react-native';
import BaseLayout from '../../../core/layouts/BaseLayout';
import Button from '../../../shared/components/Button';
import { registrarNuevoUsuario } from '../services/usuarioService';
import { APP_INFO } from '../../../core/constants/appInfo';
import { useTheme } from '../../../core/contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface RegistroUsuarioPageProps {
  onFinish: () => void;
}

/**
 * RegistroUsuarioPage: Experiencia de Onboarding Premium con flujo narrativo.
 */
export default function RegistroUsuarioPage({ onFinish }: RegistroUsuarioPageProps) {
  const { isDarkMode } = useTheme();
  const [paso, setPaso] = useState(0); // 0: Bienvenida, 1: Features, 2: Registro
  const [nombre, setNombre] = useState('');
  const [cargando, setCargando] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleNextStep = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setPaso(paso + 1);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const handlePrevStep = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setPaso(paso - 1);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleRegistro = async () => {
    if (nombre.trim().length < 2) return;
    
    setCargando(true);
    try {
      await registrarNuevoUsuario(nombre.trim());
      onFinish();
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  const features = [
    { 
        icon: ShieldCheck, 
        title: 'Privacidad Total', 
        desc: 'Tus datos son 100% locales. Nada sale de tu teléfono.',
        color: '#22C55E'
    },
    { 
        icon: TrendingUp, 
        title: 'Control Real', 
        desc: 'Visualiza tus gastos y ahorros con claridad absoluta.',
        color: '#3B82F6'
    },
    { 
        icon: Zap, 
        title: 'Rapidez Zen', 
        desc: 'Registra tus movimientos en segundos, sin complicaciones.',
        color: '#F59E0B'
    },
  ];

  // Colores dinámicos
  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSub = isDarkMode ? 'text-slate-500' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-dark-card/60' : 'bg-white';
  const borderCol = isDarkMode ? 'border-brand/20' : 'border-slate-100';

  return (
    <BaseLayout useSafeArea={true} className={isDarkMode ? 'bg-dark-bg' : 'bg-slate-50'}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                
                {/* Pantalla 0: BIENVENIDA GIGANTE */}
                {paso === 0 && (
                    <View className="flex-1 px-10 items-center justify-center">
                        <View className="relative">
                            <View className="w-56 h-56 rounded-[70px] overflow-hidden border-4 border-brand/20 shadow-2xl z-10">
                                <Image source={require('../../../assets/images/icon.png')} className="w-full h-full" />
                            </View>
                            <View className="absolute -top-10 -right-10 w-40 h-40 bg-brand/10 rounded-full blur-3xl opacity-50" />
                            <View className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl opacity-50" />
                        </View>

                        <View className="items-center mt-12 mb-20 text-center">
                            <Text className={`text-6xl font-black tracking-tighter ${textMain}`}>{APP_INFO.nombre}</Text>
                            <Text className="text-brand text-sm font-bold uppercase tracking-[6px] mt-2">{APP_INFO.tagline}</Text>
                            <Text className={`mt-6 text-center leading-6 text-lg ${textSub} font-medium px-4`}>
                                La herramienta definitiva para dominar tus finanzas personales con elegancia.
                            </Text>
                        </View>

                        <TouchableOpacity 
                            onPress={handleNextStep}
                            className="bg-brand w-full h-20 rounded-[30px] flex-row items-center justify-center shadow-2xl shadow-brand/40"
                        >
                            <Text className="text-black text-xl font-black mr-3">Empezar ahora</Text>
                            <ArrowRight size={24} color="#000" strokeWidth={3} />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Pantalla 1: REPASO DE FEATURES */}
                {paso === 1 && (
                    <View className="flex-1 px-8 pt-20 pb-16 justify-between">
                        <View>
                            <Text className={`text-4xl font-black tracking-tighter ${textMain} mb-4`}>Tu dinero, tu libertad.</Text>
                            <Text className={`text-lg ${textSub} leading-7 font-medium mb-12`}>
                                Daniq ha sido diseñado para que el control financiero no sea una carga, sino un hábito placentero.
                            </Text>

                            <View>
                                {features.map((f, i) => (
                                    <View key={i} className={`flex-row items-center mb-8 ${isDarkMode ? 'bg-dark-card/40' : 'bg-slate-100'} p-6 rounded-[35px] border ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
                                        <View className="w-14 h-14 items-center justify-center rounded-2xl mr-6" style={{ backgroundColor: `${f.color}15` }}>
                                            <f.icon size={28} color={f.color} strokeWidth={2} />
                                        </View>
                                        <View className="flex-1">
                                            <Text className={`${textMain} font-black text-xl`}>{f.title}</Text>
                                            <Text className={`${textSub} text-[13px] leading-5 mt-1 font-medium`}>{f.desc}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View className="flex-row items-center justify-between">
                            <TouchableOpacity 
                                onPress={handlePrevStep}
                                className={`${isDarkMode ? 'bg-white/5' : 'bg-slate-200'} p-5 rounded-full`}
                            >
                                <ArrowRight size={30} color={isDarkMode ? "#FFF" : "#475569"} strokeWidth={3} style={{ transform: [{ rotate: '180deg' }] }} />
                            </TouchableOpacity>
                            
                            <View className="flex-row">
                                <View className="w-8 h-2 rounded-full bg-brand mr-2" />
                                <View className="w-2 h-2 rounded-full bg-slate-400/30 mr-2" />
                            </View>

                            <TouchableOpacity 
                                onPress={handleNextStep}
                                className="bg-brand p-5 rounded-full shadow-xl shadow-brand/40"
                            >
                                <ArrowRight size={30} color="#000" strokeWidth={3} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Pantalla 2: REGISTRO FINAL */}
                {paso === 2 && (
                    <View className="flex-1 px-8 pt-24 justify-between pb-16">
                        <View>
                            <TouchableOpacity 
                                onPress={handlePrevStep}
                                className="mb-6 flex-row items-center"
                            >
                                <ArrowRight size={16} color="#22C55E" style={{ transform: [{ rotate: '180deg' }] }} />
                                <Text className="text-brand font-bold ml-2 uppercase tracking-widest text-[10px]">Volver a beneficios</Text>
                            </TouchableOpacity>

                            <View className="w-20 h-20 rounded-[28px] bg-brand/20 items-center justify-center mb-10 overflow-hidden border border-brand/30">
                                <Sparkles size={40} color="#22C55E" />
                            </View>
                            
                            <Text className={`text-5xl font-black tracking-tighter ${textMain} mb-4`}>El paso final.</Text>
                            <Text className={`text-lg ${textSub} leading-7 font-medium mb-12`}>
                                Solo necesitamos un nombre para personalizar tu tablero y darte la bienvenida oficial.
                            </Text>

                            <View className={`${cardBg} p-8 rounded-[45px] border ${borderCol} shadow-2xl relative overflow-hidden`}>
                                <View className="flex-row items-center mb-6">
                                    <Text className={`${textSub} font-black uppercase tracking-[3px] text-[10px]`}>Identidad Digital</Text>
                                </View>

                                <TextInput
                                    placeholder="Tu nombre o apodo..."
                                    placeholderTextColor={isDarkMode ? "#484F58" : "#94A3B8"}
                                    className={`${textMain} ${isDarkMode ? 'bg-black/30' : 'bg-slate-50'} p-6 rounded-3xl border ${isDarkMode ? 'border-white/10' : 'border-slate-200'} text-2xl font-bold mb-10`}
                                    value={nombre}
                                    onChangeText={setNombre}
                                    autoCapitalize="words"
                                    autoFocus
                                />

                                <Button 
                                    titulo={cargando ? "Configurando..." : "Finalizar Registro"} 
                                    Icono={Check}
                                    onPress={handleRegistro} 
                                    disabled={nombre.trim().length < 2 || cargando}
                                    className={`h-16 rounded-[25px] ${nombre.trim().length < 2 ? 'opacity-30' : ''}`}
                                />
                            </View>
                        </View>

                        <Text className={`${textSub} text-[10px] text-center font-bold uppercase tracking-[4px] italic`}>
                            {APP_INFO.nombre} • {APP_INFO.lema}
                        </Text>
                    </View>
                )}
            </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </BaseLayout>
  );
}
