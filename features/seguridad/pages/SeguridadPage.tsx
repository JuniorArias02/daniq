import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, ActivityIndicator, Alert } from 'react-native';
import { ArrowLeft, ShieldCheck, Lock, Hash, Unlock, CheckCircle2 } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import BaseLayout from '../../../core/layouts/BaseLayout';
import { useTheme } from '../../../core/contexts/ThemeContext';
import { useSeguridad } from '../hooks/useSeguridad';

export default function SeguridadPage() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const { tipoActual, cargando, configurarSinSeguridad, refrescar } = useSeguridad();

  useFocusEffect(
    useCallback(() => {
      refrescar();
    }, [])
  );

  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSub = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const cardBg = isDarkMode ? 'bg-dark-card' : 'bg-white';
  const borderCol = isDarkMode ? 'border-white/5' : 'border-slate-100';

  // Manejadores interactivos de la vista
  const onSelectSinBloqueo = async () => {
    if (tipoActual === 'ninguno') return;
    Alert.alert(
      "¿Quitar Bloqueo?",
      "Cualquiera que tenga tu teléfono podrá abrir la aplicación y ver tus finanzas.",
      [
        { text: "Mejor no", style: "cancel" },
        { text: "Sí, quitar", style: "destructive", onPress: async () => {
            await configurarSinSeguridad();
            Alert.alert("Éxito", "Bloqueo desactivado correctamente");
        }}
      ]
    );
  };

  const onSelectPin = () => {
    router.push('/seguridad/pin' as any);
  };

  const onSelectPassword = () => {
    router.push('/seguridad/contrasena' as any);
  };

  // Cargando estado
  if (cargando) {
      return (
          <BaseLayout className="items-center justify-center">
              <ActivityIndicator size="small" color="#6366F1" />
              <Text className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-4">Verificando Credenciales...</Text>
          </BaseLayout>
      );
  }

  return (
    <BaseLayout>
      <View className="px-6 pt-5 pb-4">
         <View className="flex-row items-center justify-between mb-8">
            <TouchableOpacity 
              onPress={() => router.push('/configuracion' as any)} 
              className={`w-11 h-11 ${cardBg} items-center justify-center rounded-2xl border ${borderCol} shadow-sm`}
            >
                <ArrowLeft size={22} color={isDarkMode ? "#F1F5F9" : "#0F172A"} strokeWidth={1.5} />
            </TouchableOpacity>
            <View className="w-11 h-11 rounded-2xl items-center justify-center border border-indigo-500/20 bg-indigo-500/10">
                <ShieldCheck size={20} color="#6366F1" />
            </View>
         </View>
         
         <View className="flex-row items-center">
            <Text className={`${textMain} text-3xl font-bold tracking-tight`}>Seguridad</Text>
         </View>
         <Text className={`${textSub} text-[11px] uppercase tracking-widest font-bold mt-1.5 italic`}>
           Protege tu información financiera
         </Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-2" showsVerticalScrollIndicator={false}>
        <Text className="text-slate-500 text-[10px] uppercase font-bold tracking-[3px] mb-4 ml-2">Modo de Bloqueo</Text>
        
        <View className={`${cardBg} rounded-[32px] p-2 border ${borderCol} mb-8`}>
          
          {/* Opción 1: Sin Bloqueo */}
          <TouchableOpacity 
            onPress={onSelectSinBloqueo}
            className={`flex-row items-center p-4 rounded-3xl mb-2 border ${tipoActual === 'ninguno' ? 'bg-indigo-500/10 border-indigo-500/30' : 'border-transparent'}`}
          >
            <View className={`w-10 h-10 rounded-xl items-center justify-center mr-4 ${tipoActual === 'ninguno' ? 'bg-indigo-500' : isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
              <Unlock size={18} color={tipoActual === 'ninguno' ? "white" : isDarkMode ? "#94A3B8" : "#64748B"} />
            </View>
            <View className="flex-1">
              <Text className={`${textMain} font-bold text-[15px]`}>Sin Bloqueo</Text>
              <Text className={`${textSub} text-[11px] mt-0.5`}>Acceso directo a la aplicación</Text>
            </View>
            {tipoActual === 'ninguno' && <CheckCircle2 size={18} color="#6366F1" className="ml-2" />}
          </TouchableOpacity>

          {/* Opción 2: PIN */}
          <TouchableOpacity 
            onPress={onSelectPin}
            className={`flex-row items-center p-4 rounded-3xl mb-2 border ${tipoActual === 'pin' ? 'bg-indigo-500/10 border-indigo-500/30' : 'border-transparent'}`}
          >
            <View className={`w-10 h-10 rounded-xl items-center justify-center mr-4 ${tipoActual === 'pin' ? 'bg-indigo-500' : isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
              <Hash size={18} color={tipoActual === 'pin' ? "white" : isDarkMode ? "#94A3B8" : "#64748B"} />
            </View>
            <View className="flex-1">
              <Text className={`${textMain} font-bold text-[15px]`}>PIN de Seguridad</Text>
              <Text className={`${textSub} text-[11px] mt-0.5`}>Código numérico de 4 dígitos</Text>
            </View>
            {tipoActual === 'pin' && <CheckCircle2 size={18} color="#6366F1" className="ml-2" />}
          </TouchableOpacity>

          {/* Opción 3: Contraseña */}
          <TouchableOpacity 
            onPress={onSelectPassword}
            className={`flex-row items-center p-4 rounded-3xl border ${tipoActual === 'contrasena' ? 'bg-indigo-500/10 border-indigo-500/30' : 'border-transparent'}`}
          >
            <View className={`w-10 h-10 rounded-xl items-center justify-center mr-4 ${tipoActual === 'contrasena' ? 'bg-indigo-500' : isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
              <Lock size={18} color={tipoActual === 'contrasena' ? "white" : isDarkMode ? "#94A3B8" : "#64748B"} />
            </View>
            <View className="flex-1">
              <Text className={`${textMain} font-bold text-[15px]`}>Contraseña Alfanumérica</Text>
              <Text className={`${textSub} text-[11px] mt-0.5`}>Mayor seguridad con texto</Text>
            </View>
            {tipoActual === 'contrasena' && <CheckCircle2 size={18} color="#6366F1" className="ml-2" />}
          </TouchableOpacity>

        </View>
      </ScrollView>
    </BaseLayout>
  );
}
