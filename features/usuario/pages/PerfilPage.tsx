import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { User, Mail, Phone, Save, CheckCircle, ArrowLeft, ShieldCheck, Camera } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import BaseLayout from '../../../core/layouts/BaseLayout';
import Button from '../../../shared/components/Button';
import Card from '../../../shared/components/Card';
import * as ImagePicker from 'expo-image-picker';
import { obtenerUsuarioPrincipal, actualizarPerfil } from '../services/usuarioService';
import { APP_INFO } from '../../../core/constants/appInfo';
import { useTheme } from '../../../core/contexts/ThemeContext';

/**
 * PerfilPage: Gestión del perfil con estética Modern-Premium.
 */
export default function PerfilPage() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [usuario, setUsuario] = useState<{ id: number; nombre: string; correo?: string; telefono?: string; foto_perfil?: string } | null>(null);
  
  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSub = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const textSubBold = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const cardBg = isDarkMode ? 'bg-dark-card' : 'bg-slate-50';
  const borderCol = isDarkMode ? 'border-dark-border/20' : 'border-slate-200';
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [foto, setFoto] = useState<string | undefined>(undefined);
  const [cargando, setCargando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    async function cargarDatos() {
      const data = await obtenerUsuarioPrincipal();
      if (data) {
        setUsuario(data);
        setNombre(data.nombre);
        setCorreo(data.correo || '');
        setTelefono(data.telefono || '');
        setFoto(data.foto_perfil);
      }
    }
    cargarDatos();
  }, []);

  const pickImage = async () => {
    // Solicitar permiso
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para cambiar la foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const handleGuardar = async () => {
    if (!usuario) return;
    setCargando(true);
    setGuardado(false);
    try {
      await actualizarPerfil(usuario.id, nombre, correo, telefono, foto);
      setGuardado(true);
      setTimeout(() => setGuardado(false), 3000);
    } catch (e: any) {
      Alert.alert("Error", e.message || "No se pudo actualizar el perfil");
    } finally {
      setCargando(false);
    }
  };

  return (
    <BaseLayout>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">

        {/* Superior Header Bar */}
        <View className="flex-row items-center px-6 pt-6 pb-2 justify-between">
          <TouchableOpacity onPress={() => router.back()} className={`w-10 h-10 ${isDarkMode ? 'bg-dark-card/80' : 'bg-slate-100'} items-center justify-center rounded-xl border ${borderCol}`}>
            <ArrowLeft size={18} color={isDarkMode ? "#94A3B8" : "#475569"} />
          </TouchableOpacity>
          <Text className={`${textMain} font-bold text-lg`}>Mi Perfil</Text>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>

          {/* Hero Profile Section */}
          {/* Hero Profile Section - MODO GIGANTE */}
          <View className="items-center py-12 relative">
            <View className="relative">
                <View className={`w-40 h-40 rounded-[48px] ${cardBg} border-2 ${borderCol} shadow-2xl overflow-hidden`}>
                   {foto ? (
                     <Image 
                        source={{ uri: `${foto}?t=${Date.now()}` }} 
                        className="w-full h-full" 
                        resizeMode="cover"
                        style={{ width: '100%', height: '100%' }}
                     />
                   ) : (
                     <View className={`w-full h-full items-center justify-center ${cardBg}`}>
                        <User size={80} color={isDarkMode ? "#484F58" : "#94A3B8"} strokeWidth={1} />
                     </View>
                   )}
                </View>
                <TouchableOpacity 
                    onPress={pickImage}
                    className={`absolute bottom-2 right-2 bg-brand p-3 rounded-2xl border-4 ${isDarkMode ? 'border-dark-bg' : 'border-slate-50'} shadow-xl`}
                >
                    <Camera size={20} color="#000" />
                </TouchableOpacity>
            </View>

            <View className="items-center mt-8">
              <Text className={`${textMain} text-4xl font-bold tracking-tighter`}>{nombre || 'Daniq'}</Text>
              <Text className={`${textSubBold} font-bold uppercase tracking-[2px] text-[10px] mt-2 italic`}>Configuración de Cuenta</Text>
            </View>
          </View>

          {/* Form Section */}
          <View className="mb-6">
            <Text className={`${textSubBold} font-bold uppercase tracking-[2px] text-[10px] mb-6 ml-1`}>Información Básica</Text>

            <Card variant="flat" className={`p-0 ${isDarkMode ? 'bg-dark-card/40' : 'bg-white'} border ${borderCol} overflow-hidden shadow-sm`}>

              {/* Input Nombre */}
              <View className={`p-5 border-b ${borderCol}`}>
                <View className="flex-row items-center mb-2">
                  <User size={14} color={isDarkMode ? "#94A3B8" : "#64748B"} />
                  <Text className={`${textSubBold} font-bold uppercase tracking-widest text-[9px] ml-2`}>Nombre Legal</Text>
                </View>
                <TextInput
                  placeholder="Tu nombre aquí..."
                  placeholderTextColor={isDarkMode ? "#484F58" : "#94A3B8"}
                  className={`${textMain} text-base py-1 font-semibold`}
                  value={nombre}
                  onChangeText={setNombre}
                />
              </View>

              {/* Input Correo */}
              <View className={`p-5 border-b ${borderCol}`}>
                <View className="flex-row items-center mb-2">
                  <Mail size={14} color={isDarkMode ? "#94A3B8" : "#64748B"} />
                  <Text className={`${textSubBold} font-bold uppercase tracking-widest text-[9px] ml-2`}>Email</Text>
                </View>
                <TextInput
                  placeholder="correo@ejemplo.com"
                  placeholderTextColor={isDarkMode ? "#484F58" : "#94A3B8"}
                  className={`${textMain} text-base py-1 font-semibold`}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={correo}
                  onChangeText={setCorreo}
                />
              </View>

              {/* Input Teléfono */}
              <View className="p-5">
                <View className="flex-row items-center mb-2">
                  <Phone size={14} color={isDarkMode ? "#94A3B8" : "#64748B"} />
                  <Text className={`${textSubBold} font-bold uppercase tracking-widest text-[9px] ml-2`}>Móvil / WhatsApp</Text>
                </View>
                <TextInput
                  placeholder="+57 321 0000000"
                  placeholderTextColor={isDarkMode ? "#484F58" : "#94A3B8"}
                  className={`${textMain} text-base py-1 font-semibold`}
                  keyboardType="phone-pad"
                  value={telefono}
                  onChangeText={setTelefono}
                />
              </View>

            </Card>
          </View>

          <View className="pt-4">
            <Button
              titulo={cargando ? "Procesando..." : guardado ? "¡Perfil Actualizado!" : "Guardar Perfil"}
              Icono={guardado ? CheckCircle : Save}
              onPress={handleGuardar}
              disabled={cargando}
              className={guardado ? 'bg-green-600/20 border border-green-500/30' : ''}
            />
            {guardado && <Text className="text-green-500 text-[10px] text-center mt-3 font-bold uppercase tracking-widest">Cambios sincronizados localmente</Text>}
          </View>

          <View className="items-center mt-12 mb-20">
            <View className="w-10 h-1 bg-dark-border/30 rounded-full mb-6" />
            <Text className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">{APP_INFO.nombre} — {APP_INFO.lema}</Text>
            <Text className="text-slate-700 text-[9px] mt-1 italic">{APP_INFO.tagline} • v{APP_INFO.version}</Text>
          </View>

          <View className="h-20" />
        </ScrollView>
      </KeyboardAvoidingView>
    </BaseLayout>
  );
}
