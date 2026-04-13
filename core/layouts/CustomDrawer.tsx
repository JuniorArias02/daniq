import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { AlertTriangle, BarChart3, ExternalLink, FileOutput, Globe, Home, Settings, Tag, Trash2, User, List } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import { APP_INFO } from '../../core/constants/appInfo';
import { obtenerUsuarioPrincipal } from '../../features/usuario/services/usuarioService';
import { useTheme } from '../contexts/ThemeContext';
import { sistemaService } from '../services/sistemaService';

/**
 * Interface extendida para recibir el onReset del RootLayout.
 */
interface CustomDrawerProps extends DrawerContentComponentProps {
  onReset?: () => void;
}

/**
 * CustomDrawer: Versión con Modal Premium de confirmación y reset inmediato.
 */
export default function CustomDrawer(props: CustomDrawerProps) {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const [usuario, setUsuario] = useState<any>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSub = isDarkMode ? 'text-slate-500' : 'text-slate-500';

  const cargarUser = async () => {
    const user = await obtenerUsuarioPrincipal();
    if (user) setUsuario(user);
  };

  useEffect(() => {
    cargarUser();
    const nav = props.navigation as any;
    const unsubscribe = nav.addListener('state', () => {
      cargarUser();
    });
    return () => unsubscribe();
  }, [props.navigation]);

  const menuItems = [
    { label: 'Inicio', icon: Home, route: '/(tabs)' },
    { label: 'Categorías', icon: Tag, route: '/categorias' },
    { label: 'Movimientos', icon: List, route: '/movimientos' },
    { label: 'Análisis Avanzado', icon: BarChart3, route: '/reportes_avanzados' },
  ];

  const secondaryItems = [
    { label: 'Configuración', icon: Settings, route: '/configuracion' },
    ...(__DEV__ ? [{ label: 'Espiar datos (Consola)', icon: FileOutput, route: null, action: () => sistemaService.explorarBaseDeDatos() }] : []),
  ];

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-dark-bg' : 'bg-white'}`}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: insets.top + 8 }}>
        {/* Cabecera: Tarjeta Flotante con Foto en Sidebar */}
        <TouchableOpacity
          onPress={() => router.push('/perfil')}
          className={`h-[200px] relative overflow-hidden ${isDarkMode ? 'bg-dark-card' : 'bg-slate-900'} rounded-[32px] mx-3`}
          activeOpacity={0.9}
        >
          {usuario?.foto_perfil ? (
            <Image
              source={{ uri: `${usuario.foto_perfil}?t=${Date.now()}` }}
              className="absolute inset-0 w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="absolute inset-0 items-center justify-center bg-brand/5">
              <User size={80} color="#22C55E10" strokeWidth={0.5} />
            </View>
          )}

          <View className="absolute inset-0 bg-black/40" />

          <View className="flex-1 justify-end p-6 pb-8">
            <Text className="text-white text-2xl font-black tracking-tighter shadow-2xl">
              {usuario?.nombre || 'Daniq User'}
            </Text>
            <View className="flex-row items-center mt-1">
              <View className="w-1.5 h-1.5 rounded-full bg-brand mr-2" />
              <Text className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{APP_INFO.lema}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Sección Principal */}
        <View className="p-4 pt-6">
          <Text className="text-slate-600 text-[10px] font-bold uppercase tracking-widest ml-4 mb-4">Menú Principal</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center p-4 mb-1 rounded-2xl active:bg-brand/5"
              onPress={() => item.route && router.push(item.route as any)}
            >
              <View className={`w-10 h-10 items-center justify-center ${isDarkMode ? 'bg-dark-card' : 'bg-slate-100'} rounded-xl mr-4 border ${isDarkMode ? 'border-dark-border/20' : 'border-slate-200'}`}>
                <item.icon size={20} color={item.route ? "#22C55E" : (isDarkMode ? "#484F58" : "#94A3B8")} />
              </View>
              <Text className={`${item.route ? textMain : textSub} font-bold text-lg tracking-tight`}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sección Secundaria */}
        <View className={`p-4 border-t ${isDarkMode ? 'border-dark-border/10' : 'border-slate-100'} mt-2`}>
          <Text className="text-slate-600 text-[10px] font-bold uppercase tracking-widest ml-4 mb-4">Avanzado</Text>
          {secondaryItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center p-4 mb-1 rounded-2xl active:bg-brand/5"
              onPress={() => {
                if (item.action) {
                  item.action();
                } else if (item.route) {
                  router.push(item.route as any);
                }
              }}
            >
              <item.icon size={18} color={isDarkMode ? "#484F58" : "#94A3B8"} />
              <Text className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} ml-4 font-bold text-base`}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </DrawerContentScrollView>

      {/* Pie de Página: App Info, Web & Reset */}
      <View className={`p-8 border-t ${isDarkMode ? 'border-dark-border/10' : 'border-slate-100'}`}>
        <View className="items-center mb-6">
          <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-[2px]">{APP_INFO.nombre}</Text>
          <Text className="text-slate-600 text-[9px] mt-1 italic">{APP_INFO.tagline} • v{APP_INFO.version}</Text>
        </View>

        {/* Botón Web Oficial */}
        <TouchableOpacity
          onPress={() => Linking.openURL('https://daniq.vercel.app')}
          activeOpacity={0.8}
          className={`flex-row items-center justify-between p-4 mb-3 rounded-2xl border ${
            isDarkMode
              ? 'bg-brand/10 border-brand/20'
              : 'bg-brand/5 border-brand/20'
          }`}
        >
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-xl bg-brand items-center justify-center mr-3">
              <Globe size={16} color="#fff" strokeWidth={2} />
            </View>
            <View>
              <Text className="text-brand font-black text-[13px] tracking-tight">daniq.vercel.app</Text>
              <Text className={`${textSub} text-[9px] font-bold uppercase tracking-widest`}>Sitio Web Oficial</Text>
            </View>
          </View>
          <ExternalLink size={14} color="#22C55E" strokeWidth={2} />
        </TouchableOpacity>

      </View>
    </View>
  );
}
