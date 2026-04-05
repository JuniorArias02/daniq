import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Layers, Plus, TrendingDown, Clock, MoreVertical, Trash2, Menu } from 'lucide-react-native';
import { useFocusEffect, useRouter, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import BaseLayout from '../../../core/layouts/BaseLayout';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';
import { obtenerUsuarioPrincipal } from '../../usuario/services/usuarioService';
import ModalCrearBloque from '../components/ModalCrearBloque';
import ModalCrearGasto from '../../gastos/components/ModalCrearGasto';
import { listarBloquesUsuario, borrarBloque, crearNuevoBloque } from '../services/bloqueService';
import { formatearCOP } from '../../../core/utils/formatearDinero';
import ModalConfirmacion from '../../../shared/components/ModalConfirmacion';
import { useTheme } from '../../../core/contexts/ThemeContext';

/**
 * BloquesPage: Vista principal de los "Bolsillos" o Bolsas de Gasto.
 */
export default function BloquesPage() {
  const router = useRouter();
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const [bloques, setBloques] = useState<any[]>([]);
  
  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSub = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const textSubBold = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const cardBg = isDarkMode ? 'bg-dark-card' : 'bg-slate-50';
  const borderCol = isDarkMode ? 'border-dark-border/40' : 'border-slate-200';

  const [cargando, setCargando] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [gastoModalVisible, setGastoModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [bloqueAEliminar, setBloqueAEliminar] = useState<{id: number, nombre: string} | null>(null);

  const handleOpenDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const cargarDatos = useCallback(async () => {
    const user = await obtenerUsuarioPrincipal();
    if (user) {
      const data = await listarBloquesUsuario(user.id);
      setBloques(data);
    }
    setCargando(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [cargarDatos])
  );

  const handleCrear = async (nombre: string, color: string) => {
    const user = await obtenerUsuarioPrincipal();
    if (user) {
      await crearNuevoBloque(user.id, nombre, color);
      cargarDatos();
    }
  };

  const handleEliminar = (id: number, nombre: string) => {
    setBloqueAEliminar({ id, nombre });
    setConfirmModalVisible(true);
  };

  const onConfirmEliminar = async () => {
    if (bloqueAEliminar) {
       await borrarBloque(bloqueAEliminar.id);
       setConfirmModalVisible(false);
       setBloqueAEliminar(null);
       cargarDatos();
    }
  };

  return (
    <BaseLayout>
      {/* Header Moderno */}
      <View className="flex-row items-center justify-between px-6 py-5 mt-2">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleOpenDrawer} className="mr-4 p-1">
            <Menu size={28} color={isDarkMode ? "#F1F5F9" : "#0F172A"} strokeWidth={1.5} />
          </TouchableOpacity>
          <View>
            <View className="flex-row items-center">
              <Text className={`${textMain} text-2xl font-bold tracking-tight`}>Bolsillos</Text>
              <View className="bg-brand/20 px-2 py-0.5 rounded-full ml-3 border border-brand/30">
                <Text className="text-brand text-[10px] font-bold uppercase">{bloques.length}</Text>
              </View>
            </View>
            <Text className={`${textSubBold} text-[11px] uppercase tracking-widest font-bold mt-0.5`}>Control de Presupuesto</Text>
          </View>
        </View>
        <Button variant="icon" Icono={Plus} onPress={() => setModalVisible(true)} />
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {cargando ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#22C55E" />
          </View>
        ) : bloques.length === 0 ? (
          <View className={`items-center justify-center py-24 ${isDarkMode ? 'bg-dark-card/20' : 'bg-slate-100'} rounded-[32px] border border-dashed ${borderCol} mt-4`}>
             <Layers size={48} color={isDarkMode ? "#484F58" : "#94A3B8"} strokeWidth={1} />
             <Text className={`${textSub} mt-5 font-medium text-center px-10`}>No tienes bolsillos de gasto aún. Crea uno para empezar a separar tu dinero.</Text>
             <TouchableOpacity 
                onPress={() => setModalVisible(true)}
                className="mt-8 bg-brand/10 px-6 py-3 rounded-xl border border-brand/20"
             >
                <Text className="text-brand font-bold uppercase tracking-widest text-[11px]">Crear Primer Bolsillo</Text>
             </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between pt-2">
            {bloques.map((bloque) => (
              <TouchableOpacity 
                key={bloque.id} 
                className="w-[48%] mb-4"
                onPress={() => router.push({ pathname: '/bloque/[id]', params: { id: bloque.id.toString() } })}
                onLongPress={() => handleEliminar(bloque.id, bloque.nombre)}
              >
                <Card variant="flat" className={`p-5 border ${borderCol} relative overflow-hidden`}>
                   {/* Background logic color */}
                   <View 
                     className="absolute top-0 right-0 w-16 h-16 opacity-10 rounded-bl-full" 
                     style={{ backgroundColor: bloque.color || '#22C55E' }}
                   />
                   
                   <View className="w-10 h-10 rounded-xl items-center justify-center mb-4" style={{ backgroundColor: `${bloque.color || '#22C55E'}20` }}>
                      <TrendingDown size={20} color={bloque.color || '#22C55E'} />
                   </View>

                   <Text className={`${textMain} font-bold text-[16px] mb-1`} numberOfLines={1}>{bloque.nombre}</Text>
                   <Text className={`${textSubBold} text-[10px] uppercase font-bold tracking-widest mb-4`}>{bloque.tipo || 'Gasto'}</Text>
                   
                   <View className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-dark-border/20' : 'border-slate-100'}`}>
                       <Text className={`${textSubBold} text-[9px] uppercase font-bold tracking-widest`}>Ejecutado</Text>
                       <Text className={`${textMain} font-bold text-lg`}>{formatearCOP(bloque.gastado || 0)}</Text>
                   </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View className="h-40" />
      </ScrollView>

      {/* Botón Flotante Global (Presente en Inicio y Bloques) */}
      <Button 
        variant="fab" 
        Icono={Plus} 
        onPress={() => setGastoModalVisible(true)}
      />

      {/* Formulario Modal de Bloques */}
      <ModalCrearBloque 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        onSave={handleCrear} 
      />

      {/* Formulario Modal de Gastos (Actualiza la vista) */}
      <ModalCrearGasto 
        visible={gastoModalVisible} 
        onClose={() => setGastoModalVisible(false)} 
        onSave={() => cargarDatos()} 
      />

      {/* Modal Premium de Confirmación */}
      <ModalConfirmacion 
        visible={confirmModalVisible}
        onClose={() => setConfirmModalVisible(false)}
        onConfirm={onConfirmEliminar}
        titulo="Eliminar Bolsillo"
        mensaje={`¿Estás seguro de que quieres borrar "${bloqueAEliminar?.nombre}"? Todos los registros asociados se perderán para siempre.`}
        textoConfirmar="Borrar para siempre"
      />
    </BaseLayout>
  );
}


