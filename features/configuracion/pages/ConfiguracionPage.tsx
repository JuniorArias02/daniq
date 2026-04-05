import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert, ActivityIndicator, Linking } from 'react-native';
import { ArrowLeft, Moon, Bell, LifeBuoy, ChevronRight, Settings, Smartphone, RefreshCcw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import BaseLayout from '../../../core/layouts/BaseLayout';
import Card from '../../../shared/components/Card';
import { obtenerUsuarioPrincipal } from '../../usuario/services/usuarioService';
import { obtenerPreferencias, cambiarModoOscuro, cambiarNotificaciones } from '../services/configuracionService';
import { useNotificaciones } from '../../notificaciones/hooks/useNotificaciones';
import ModalConfirmacion from '../../../shared/components/ModalConfirmacion';

import * as Updates from 'expo-updates';

import { useTheme } from '../../../core/contexts/ThemeContext';

/**
 * ConfiguracionPage: Centro de control del usuario.
 * Maneja temas, notificaciones y soporte.
 */
export default function ConfiguracionPage() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();
  const { testAlert } = useNotificaciones(); // Hook de Notificaciones
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [modalSoporteVisible, setModalSoporteVisible] = useState(false);
  
  // Estado para alertas genéricas premium
  const [modalInfo, setModalInfo] = useState({
    visible: false,
    titulo: '',
    mensaje: '',
    tipo: 'info' as 'info' | 'danger' | 'warning'
  });

  const [cargando, setCargando] = useState(true);

  // Helper para mostrar alertas con nuestro estilo
  const alertar = (titulo: string, mensaje: string, tipo: 'info' | 'danger' | 'warning' = 'info') => {
    setModalInfo({ visible: true, titulo, mensaje, tipo });
  };

  // Colores Dinámicos Estabilizados
  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSub = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const textSubBold = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const cardBg = isDarkMode ? 'bg-dark-card' : 'bg-white';
  const borderCol = isDarkMode ? 'border-white/5' : 'border-slate-100';

  // Cargar preferencias de la BD al entrar (notificaciones)
  React.useEffect(() => {
    async function loadData() {
        try {
            const user = await obtenerUsuarioPrincipal();
            if (user) {
                const prefs = await obtenerPreferencias(user.id);
                setNotificationsEnabled(prefs.notificaciones);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setCargando(false);
        }
    }
    loadData();
  }, []);

  const handleToggleDarkMode = async () => {
    await toggleTheme();
  };

  const toggleNotifications = async (val: boolean) => {
    setNotificationsEnabled(val);
    const user = await obtenerUsuarioPrincipal();
    if (user) await cambiarNotificaciones(user.id, val);
  };

  const handleReportProblem = () => {
    setModalSoporteVisible(true);
  };

  const contactarSoporte = () => {
    Linking.openURL('mailto:junior.arias04yt@gmail.com');
  };

  const handleUpdateCheck = async () => {
    try {
        if (__DEV__) {
            alertar("Modo Desarrollo", "En Expo Go las actualizaciones son automáticas cada vez que guardas tu código en la PC.", "info");
            return;
        }

        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            alertar(
                "¡Actualización Lista!", 
                "Se ha descargado una nueva versión de Daniq. Pulsa Confirmar para reiniciar la app ahora.",
                "info"
            );
        } else {
            alertar("Daniq al Día", "Ya tienes la última versión oficial instalada. ¡Sigue ahorrando!", "info");
        }
    } catch (e) {
        console.error(e);
        alertar("Sincronización", "No pudimos conectar con los servidores de Expo en este momento.", "danger");
    }
  };

  const handleSendTest = async () => {
     await testAlert();
  };

  // Loader state
  if (cargando) {
      return (
          <BaseLayout className="items-center justify-center">
              <ActivityIndicator size="small" color="#22C55E" />
              <Text className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-4">Sincronizando Ajustes...</Text>
          </BaseLayout>
      );
  }

  return (
    <BaseLayout>
      {/* Header Premium */}
      <View className="px-6 pt-5 pb-4">
         <View className="flex-row items-center justify-between mb-8">
            <TouchableOpacity 
              onPress={() => router.back()} 
              className={`w-11 h-11 ${cardBg} items-center justify-center rounded-2xl border ${borderCol} shadow-sm`}
            >
                <ArrowLeft size={22} color={isDarkMode ? "#F1F5F9" : "#0F172A"} strokeWidth={1.5} />
            </TouchableOpacity>
            <View className="w-11 h-11 rounded-2xl items-center justify-center border border-brand/20 bg-brand/10">
                <Settings size={20} color="#22C55E" />
            </View>
         </View>
         
         <View className="flex-row items-center">
            <Text className={`${textMain} text-3xl font-bold tracking-tight`}>Preferencias</Text>
            <View className="bg-brand/20 px-2 py-0.5 rounded-full ml-3 border border-brand/30">
                <Text className="text-brand text-[10px] font-bold uppercase">Ajustes</Text>
            </View>
         </View>
         <Text className={`${textSub} text-[11px] uppercase tracking-widest font-bold mt-1.5 italic`}>Personaliza tu experiencia Daniq</Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* Sección: Apariencia */}
        <Text className="text-slate-500 text-[10px] uppercase font-bold tracking-[3px] mb-4 ml-2">Personalización</Text>
        <Card variant="flat" className="p-6 mb-8">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-xl bg-purple-500/10 items-center justify-center mr-4">
                        <Moon size={20} color="#A855F7" />
                    </View>
                    <View>
                        <Text className={`${textMain} font-bold text-[15px]`}>Modo Oscuro</Text>
                        <Text className={`${textSub} text-xs mt-0.5`}>Ahorra batería y descansa la vista</Text>
                    </View>
                </View>
                <Switch 
                    value={isDarkMode} 
                    onValueChange={handleToggleDarkMode}
                    trackColor={{ false: '#30363D', true: '#22C55E' }}
                    thumbColor="#FFF"
                />
            </View>
        </Card>

        {/* Sección: Alertas */}
        <Text className="text-slate-500 text-[10px] uppercase font-bold tracking-[3px] mb-4 ml-2">Alertas y Avisos</Text>
        <Card variant="flat" className="p-6 mb-8">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-xl bg-blue-500/10 items-center justify-center mr-4">
                        <Bell size={20} color="#3B82F6" />
                    </View>
                    <View>
                        <Text className={`${textMain} font-bold text-[15px]`}>Notificaciones</Text>
                        <Text className={`${textSub} text-xs mt-0.5`}>Recordatorios y alertas de gastos</Text>
                    </View>
                </View>
                <Switch 
                    value={notificationsEnabled} 
                    onValueChange={toggleNotifications}
                    trackColor={{ false: '#30363D', true: '#22C55E' }}
                    thumbColor="#FFF"
                />
            </View>
            
            {__DEV__ && (
              <View className={`mt-6 pt-6 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-50'}`}>
                   <Text className={`${textMain} font-bold text-sm mb-1`}>Probar Alertas Premium</Text>
                   <Text className={`${textSub} text-[11px] mb-4`}>Verifica que recibes los saludos personalizados de Daniq.</Text>
                   
                   <TouchableOpacity 
                      onPress={handleSendTest}
                      activeOpacity={0.7}
                      className="bg-brand w-full h-14 rounded-2xl items-center justify-center shadow-lg shadow-brand/20"
                   >
                      <Text className="text-black font-black text-xs uppercase tracking-widest">Enviar Alerta de Prueba</Text>
                   </TouchableOpacity>
              </View>
            )}
        </Card>

        {/* Sección: Soporte */}
        <Text className="text-slate-500 text-[10px] uppercase font-bold tracking-[3px] mb-4 ml-2">Ayuda</Text>
        <TouchableOpacity 
            onPress={handleReportProblem}
            className={`${cardBg} ${borderCol} p-6 rounded-[32px] border ${isDarkMode ? '' : 'shadow-sm'} flex-row items-center justify-between mb-8`}
        >
            <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-xl bg-red-500/10 items-center justify-center mr-4">
                    <LifeBuoy size={20} color="#EF4444" />
                </View>
                <View>
                    <Text className={`${textMain} font-bold text-[15px]`}>Reportar un Problema</Text>
                    <Text className={`${textSub} text-xs mt-0.5`}>Algo no funciona como debería</Text>
                </View>
            </View>
            <ChevronRight size={18} color={isDarkMode ? "#484F58" : "#94A3B8"} />
        </TouchableOpacity>

        {/* Sección: Actualizaciones */}
        <Text className="text-slate-500 text-[10px] uppercase font-bold tracking-[3px] mb-4 ml-2">App Daniq</Text>
        <Card variant="flat" className="p-6 mb-12">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-xl bg-orange-500/10 items-center justify-center mr-4">
                        <RefreshCcw size={18} color="#F97316" />
                    </View>
                    <View>
                        <Text className={`${textMain} font-bold text-[15px]`}>Versión Actual</Text>
                        <Text className={`${textSub} text-xs mt-0.5`}>Daniq v1.0.0 Premium</Text>
                    </View>
                </View>
                <TouchableOpacity 
                   onPress={handleUpdateCheck}
                   activeOpacity={0.7}
                   className="bg-orange-500/10 px-4 py-2 rounded-xl"
                >
                   <Text className="text-orange-500 font-bold text-[10px] uppercase">Actualizar</Text>
                </TouchableOpacity>
            </View>
        </Card>

        <View className="items-center opacity-20 mb-10">
           <Text className="text-slate-500 text-[10px] font-black uppercase tracking-[5px]">Daniq v1.0.0 Premium</Text>
        </View>
      </ScrollView>

      {/* Modal Premium de Soporte */}
      <ModalConfirmacion
        visible={modalSoporteVisible}
        onClose={() => setModalSoporteVisible(false)}
        onConfirm={contactarSoporte}
        titulo="¿Contactar Soporte?"
        mensaje="Esto abrirá tu aplicación de correo para que nos escribas directamente. ¿Deseas continuar?"
        textoConfirmar="Contactar"
        tipo="info"
      />

      {/* Modal Genérico para avisos de actualización */}
      <ModalConfirmacion
        visible={modalInfo.visible}
        onClose={() => setModalInfo({ ...modalInfo, visible: false })}
        onConfirm={() => {
            setModalInfo({ ...modalInfo, visible: false });
            if (modalInfo.titulo === "¡Actualización Lista!") {
                Updates.reloadAsync();
            }
        }}
        titulo={modalInfo.titulo}
        mensaje={modalInfo.mensaje}
        textoConfirmar={modalInfo.titulo === "¡Actualización Lista!" ? "Reiniciar" : "Entendido"}
        tipo={modalInfo.tipo}
      />
    </BaseLayout>
  );
}
