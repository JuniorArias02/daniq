import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Layers, Plus, TrendingDown, Clock, MoreVertical, Trash2, Menu } from 'lucide-react-native';
import { useFocusEffect, useRouter, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import BaseLayout from '../../../core/layouts/BaseLayout';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';
import { obtenerUsuarioPrincipal } from '../../usuario/services/usuarioService';
import ModalCrearBloque from '../components/ModalCrearBloque';
import ModalCrearGasto from '../../gastos/components/ModalCrearGasto';
import { listarBloquesUsuario, borrarBloque, crearNuevoBloque, actualizarBloque } from '../services/bloqueService';
import { formatearCOP } from '../../../core/utils/formatearDinero';
import ModalConfirmacion from '../../../shared/components/ModalConfirmacion';
import ModalOpcionesBloque from '../components/ModalOpcionesBloque';
import { Image } from 'expo-image';
import { useTheme } from '../../../core/contexts/ThemeContext';
import { BlurView } from 'expo-blur';

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
  const [opcionesModalVisible, setOpcionesModalVisible] = useState(false);
  const [blurOpciones, setBlurOpciones] = useState(false);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<any | null>(null);
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

  const handleCrear = async (nombre: string, color: string, imagen?: string) => {
    const user = await obtenerUsuarioPrincipal();
    if (user) {
      if (bloqueSeleccionado) {
          await actualizarBloque(bloqueSeleccionado.id, nombre, color, imagen);
      } else {
          await crearNuevoBloque(user.id, nombre, color, imagen);
      }
      setBloqueSeleccionado(null);
      cargarDatos();
    }
  };

  const handleAbrirOpciones = (bloque: any) => {
    setBloqueSeleccionado(bloque);
    setOpcionesModalVisible(true);
  };

  const handleEditar = () => {
    setModalVisible(true);
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
                onLongPress={() => handleAbrirOpciones(bloque)}
              >
                <Card variant="flat" className={`p-5 border ${borderCol} relative overflow-hidden min-h-[220px] justify-between`}>
                   <View>
                      {/* Background logic color decorativo */}
                      <View 
                        className="absolute -top-20 -right-20 w-44 h-44 opacity-[0.18] rounded-full" 
                        style={{ backgroundColor: bloque.color || '#22C55E' }}
                      />
                      
                      <View className="w-14 h-14 rounded-[22px] items-center justify-center mb-5 overflow-hidden shadow-sm" style={{ backgroundColor: `${bloque.color || '#22C55E'}20` }}>
                          {bloque.imagen ? (
                            <Image source={{ uri: bloque.imagen }} contentFit="cover" style={{ width: '100%', height: '100%' }} />
                          ) : (
                            <TrendingDown size={24} color={bloque.color || '#22C55E'} />
                          )}
                      </View>

                      <Text 
                        className={`${textMain} font-black text-[17px] leading-tight mb-1`} 
                        numberOfLines={2}
                      >
                        {bloque.nombre}
                      </Text>
                      <Text className="text-brand font-bold text-[9px] uppercase tracking-[2px] opacity-60">
                        {bloque.tipo || 'Bolsillo'}
                      </Text>
                   </View>
                   
                   <View className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                       <View className="flex-row justify-between items-end mb-1">
                          <Text className={`${textSubBold} text-[9px] uppercase font-bold tracking-[2px]`}>Ejecutado</Text>
                          {bloque.presupuestado > 0 && (
                            <Text className="text-brand font-black text-[9px] uppercase">
                                {Math.round(((bloque.gastado || 0) / bloque.presupuestado) * 100)}%
                            </Text>
                          )}
                       </View>
                       
                       <View className="flex-row items-baseline">
                          <Text className={`${textMain} font-black text-xl tracking-tighter`}>{formatearCOP(bloque.gastado || 0)}</Text>
                       </View>

                       {/* Barra de Progreso Condicional */}
                       {bloque.presupuestado > 0 && (
                           <View className="h-1.5 w-full bg-slate-500/20 rounded-full mt-3 overflow-hidden">
                               <View 
                                  className="h-full bg-brand" 
                                  style={{ 
                                      width: `${Math.min(100, ((bloque.gastado || 0) / bloque.presupuestado) * 100)}%`,
                                      backgroundColor: bloque.color || '#22C55E'
                                  }}
                               />
                           </View>
                       )}
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
        onClose={() => {
            setModalVisible(false);
            setBloqueSeleccionado(null);
        }} 
        onSave={handleCrear}
        bloqueAEditar={bloqueSeleccionado}
      />

      {/* Blur sincronizado con la animación del modal de opciones */}
      {blurOpciones && (
        <TouchableWithoutFeedback onPress={() => setOpcionesModalVisible(false)}>
          <BlurView
            intensity={60}
            tint={isDarkMode ? 'dark' : 'light'}
            experimentalBlurMethod="dimezisBlurView"
            style={[StyleSheet.absoluteFill, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.55)' : 'rgba(15,23,42,0.4)' }]}
          />
        </TouchableWithoutFeedback>
      )}

      {/* Modal de Opciones (Editar/Eliminar) */}
      <ModalOpcionesBloque
        visible={opcionesModalVisible}
        onClose={() => setOpcionesModalVisible(false)}
        onEdit={handleEditar}
        onDelete={() => handleEliminar(bloqueSeleccionado?.id, bloqueSeleccionado?.nombre)}
        nombreBloque={bloqueSeleccionado?.nombre || ''}
        onModalWillShow={() => setBlurOpciones(true)}
        onModalHide={() => setBlurOpciones(false)}
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


