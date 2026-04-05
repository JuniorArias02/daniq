import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Plus, ArrowLeft, TrendingDown, Clock, Tag, ShoppingCart, Utensils, Zap, Bus, Coffee, Heart, Briefcase, Car, Home, AlertTriangle } from 'lucide-react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import BaseLayout from '../../../core/layouts/BaseLayout';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';
import { obtenerDetalleBloque } from '../services/bloqueService';
import { obtenerPorBloque } from '../../gastos/services/gastoService';
import { itemBloqueService } from '../services/itemBloqueService';
import ModalCrearGasto from '../../gastos/components/ModalCrearGasto';
import ModalCrearItemBloque from '../components/ModalCrearItemBloque';
import { formatearCOP } from '../../../core/utils/formatearDinero';
import { useTheme } from '../../../core/contexts/ThemeContext';
import { Trash2 } from 'lucide-react-native';
import Modal from 'react-native-modal';

const ICON_MAP: Record<string, any> = { ShoppingCart, Utensils, Zap, Bus, Coffee, Heart, Briefcase, Car, Home };

export default function DetalleBloquePage({ id }: { id: string }) {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [bloque, setBloque] = useState<any>(null);
  const [gastos, setGastos] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  
  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSub = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const textSubBold = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const cardBg = isDarkMode ? 'bg-dark-card' : 'bg-slate-50';
  const borderCol = isDarkMode ? 'border-dark-border/40' : 'border-slate-200';
  const [cargando, setCargando] = useState(true);
  const [modalGastoVisible, setModalGastoVisible] = useState(false);
  const [modalItemVisible, setModalItemVisible] = useState(false);
  
  // Estado para el modal de eliminación premium
  const [modalEliminarVisible, setModalEliminarVisible] = useState(false);
  const [itemAEliminar, setItemAEliminar] = useState<{id: number, nombre: string} | null>(null);

  const cargarDatos = useCallback(async () => {
    try {
      const bId = parseInt(id);
      const [resBloque, resGastos, resItems] = await Promise.all([
        obtenerDetalleBloque(bId),
        obtenerPorBloque(bId),
        itemBloqueService.listarPorBloque(bId)
      ]);
      setBloque(resBloque);
      setGastos(resGastos);
      setItems(resItems);
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  }, [id]);

  const handleAgregarItem = async (nombre: string, precio: number) => {
    await itemBloqueService.agregarItem(parseInt(id), nombre, precio);
    cargarDatos();
  };

  const handleEliminarItem = (itemId: number, nombre: string) => {
    setItemAEliminar({ id: itemId, nombre });
    setModalEliminarVisible(true);
  };

  const ejecutarEliminacion = async () => {
    if (itemAEliminar) {
      await itemBloqueService.eliminarItem(itemAEliminar.id);
      setModalEliminarVisible(false);
      setItemAEliminar(null);
      cargarDatos();
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [cargarDatos])
  );

  if (cargando) {
      return (
        <BaseLayout>
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#22C55E" />
            </View>
        </BaseLayout>
      );
  }

  return (
    <BaseLayout>
      {/* Header Premium de Detalle */}
      <View className="px-6 pt-5 pb-4">
         <View className="flex-row items-center justify-between mb-8">
            <TouchableOpacity onPress={() => router.back()} className={`w-11 h-11 ${isDarkMode ? 'bg-dark-card' : 'bg-white shadow-sm'} items-center justify-center rounded-2xl border ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
                <ArrowLeft size={22} color={isDarkMode ? "#F1F5F9" : "#0F172A"} strokeWidth={1.5} />
            </TouchableOpacity>
            <View className="w-11 h-11 rounded-2xl items-center justify-center border border-brand/20 bg-brand/10" style={{ borderColor: `${bloque?.color || '#22C55E'}40` }}>
                <TrendingDown size={20} color={bloque?.color || '#22C55E'} />
            </View>
         </View>
         
         <View className="flex-row items-center">
            <Text className={`${textMain} text-3xl font-bold tracking-tight`}>{bloque?.nombre}</Text>
            <View className="bg-brand/20 px-2 py-0.5 rounded-full ml-3 border border-brand/30" style={{ borderColor: `${bloque?.color || '#22C55E'}40` }}>
                <Text className="text-brand text-[10px] font-bold uppercase" style={{ color: bloque?.color }}>Activo</Text>
            </View>
         </View>
         <Text className={`${textSubBold} text-[11px] uppercase tracking-widest font-bold mt-1.5 line-clamp-1 italic`}>Gestión de presupuesto por bolsillo</Text>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Card de Resumen con Diseño Moderno */}
        <Card variant="flat" className={`mt-4 p-6 border ${isDarkMode ? 'border-white/5 bg-dark-card' : 'border-slate-200 bg-white shadow-md'} relative overflow-hidden`}>
            <View 
                className="absolute -top-10 -right-10 w-32 h-32 opacity-10 rounded-full" 
                style={{ backgroundColor: bloque?.color }}
            />
            
            <View className="flex-row justify-between items-center">
                <View>
                    <Text className={`${textSubBold} text-[9px] uppercase font-bold tracking-widest mb-1`}>Total Ejecutado</Text>
                    <Text className={`${textMain} text-4xl font-black tracking-tighter`}>{formatearCOP(bloque?.gastado || 0)}</Text>
                </View>
                <View className="items-end">
                    <Text className="text-brand font-bold text-[9px] uppercase tracking-widest mb-1">Presupuestado</Text>
                    <Text className={`${textSub} font-black text-lg tracking-tighter`}>
                        {formatearCOP(items.reduce((acc, curr) => acc + curr.precio, 0))}
                    </Text>
                </View>
            </View>

            {/* Barra de Progreso Visual */}
            <View className="mt-6">
                <View className="h-1.5 w-full bg-slate-500/20 rounded-full overflow-hidden">
                    <View 
                       className="h-full bg-brand" 
                       style={{ 
                          width: `${Math.min(100, ((bloque?.gastado || 0) / (items.reduce((acc, curr) => acc + curr.precio, 0) || 1)) * 100)}%`,
                          backgroundColor: bloque?.color || '#22C55E'
                       }} 
                    />
                </View>
            </View>
        </Card>

        {/* Sección de Ítems Planificados (Presupuesto) */}
        <View className="mt-10">
            <View className="flex-row items-center justify-between mb-6">
                <Text className={`${textMain} font-bold text-lg`}>Plan de este bolsillo</Text>
                <TouchableOpacity 
                   onPress={() => setModalItemVisible(true)}
                   className="flex-row items-center bg-brand/10 px-3 py-1.5 rounded-xl border border-brand/20"
                >
                    <Plus size={14} color="#22C55E" strokeWidth={3} />
                    <Text className="text-brand font-bold text-[10px] uppercase ml-1.5 tracking-widest">Añadir Meta</Text>
                </TouchableOpacity>
            </View>
            
            <View className={`${cardBg} rounded-[32px] p-2 border ${borderCol}`}>
                {items.length === 0 ? (
                    <View className="py-10 items-center">
                        <ShoppingCart size={24} color={isDarkMode ? "#484F58" : "#94A3B8"} strokeWidth={1.5} />
                        <Text className={`${textSub} text-[11px] mt-2 italic`}>Sin metas planificadas aún.</Text>
                    </View>
                ) : items.map((item) => (
                    <View key={item.id} className="flex-row items-center justify-between p-4 px-6 border-b border-white/5 last:border-b-0">
                        <View className="flex-row items-center flex-1">
                            <View className="w-2 h-2 rounded-full mr-4" style={{ backgroundColor: bloque?.color }} />
                            <Text className={`${textMain} font-bold text-[13px]`} numberOfLines={1}>{item.nombre}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Text className={`${textSub} font-bold text-[13px] mr-4`}>{formatearCOP(item.precio)}</Text>
                            <TouchableOpacity onPress={() => handleEliminarItem(item.id, item.nombre)} hitSlop={15}>
                                <Trash2 size={16} color="#EF4444" opacity={0.6} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
        </View>

        {/* Lista de Movimientos */}
        <View className="mt-10">
            <Text className={`${textMain} font-bold text-lg mb-6`}>Movimientos de este bolsillo</Text>
            
            {gastos.length === 0 ? (
                <View className={`py-20 items-center justify-center ${isDarkMode ? 'bg-dark-card/20' : 'bg-slate-50'} rounded-[32px] border border-dashed ${borderCol}`}>
                    <Clock size={40} color={isDarkMode ? "#484F58" : "#CBD5E1"} strokeWidth={1} />
                    <Text className={`${textSub} mt-4 text-center px-10 italic font-medium`}>No hay gastos registrados en este bolsillo todavía.</Text>
                </View>
            ) : gastos.map((gasto) => {
                const CategoryIcon = ICON_MAP[gasto.categoria_icono] || Tag;
                return (
                    <View key={gasto.id} className={`flex-row items-center justify-between ${isDarkMode ? 'bg-dark-card/60' : 'bg-white'} p-5 rounded-3xl mb-3 border ${borderCol} ${!isDarkMode ? 'shadow-sm' : ''}`}>
                        <View className="flex-row items-center flex-1">
                            <View className="w-11 h-11 rounded-xl items-center justify-center mr-4" style={{ backgroundColor: `${gasto.categoria_color || '#30363D'}20` }}>
                                <CategoryIcon size={20} color={gasto.categoria_color || (isDarkMode ? '#94A3B8' : '#64748B')} />
                            </View>
                            <View className="flex-1">
                                <Text className={`${textMain} font-bold text-[15px]`} numberOfLines={1}>{gasto.descripcion}</Text>
                                <Text className={`${textSubBold} text-[10px] mt-1 font-bold uppercase tracking-[1px]`}>{gasto.categoria_nombre || 'Sin Tag'}</Text>
                            </View>
                        </View>
                        <View className="items-end">
                            <Text className="text-red-500 font-bold text-[15px]">{formatearCOP(gasto.monto)}</Text>
                            <Text className={`${textSub} text-[9px] mt-1 font-medium`}>{gasto.fecha}</Text>
                        </View>
                    </View>
                );
            })}
        </View>

        <View className="h-20" />
      </ScrollView>

      {/* FAB para acceso rápido también aquí */}
      <Button 
        variant="fab" 
        Icono={Plus} 
        onPress={() => setModalGastoVisible(true)}
      />

      {/* Modal para crear gasto (con bloque pre-seleccionado es automático) */}
      <ModalCrearGasto 
        visible={modalGastoVisible} 
        onClose={() => setModalGastoVisible(false)} 
        onSave={() => cargarDatos()} 
        initialBloqueId={parseInt(id)}
      />

      {/* Modal para crear ítem de presupuesto */}
      <ModalCrearItemBloque
        visible={modalItemVisible}
        onClose={() => setModalItemVisible(false)}
        onSave={handleAgregarItem}
      />

      {/* Modal Premium de Eliminación */}
      <Modal
        isVisible={modalEliminarVisible}
        onBackdropPress={() => setModalEliminarVisible(false)}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropOpacity={0.6}
        className="m-0 justify-end"
      >
        <View className={`${isDarkMode ? 'bg-dark-bg' : 'bg-white'} p-8 pt-12 rounded-t-[50px] border-t border-red-500/20 shadow-2xl`}>
          <View className="items-center mb-8">
            <View className="w-16 h-16 bg-red-500/10 rounded-full items-center justify-center mb-6 border border-red-500/20">
              <AlertTriangle size={32} color="#EF4444" />
            </View>
            <Text className={`${textMain} text-2xl font-black text-center tracking-tight mb-3`}>¿Eliminar Meta?</Text>
            <Text className={`${textSub} text-center text-base leading-6 px-4`}>
              Estás a punto de borrar la meta <Text className="font-bold">{itemAEliminar?.nombre}</Text>. Esta acción no se puede deshacer.
            </Text>
          </View>

          <View className="space-y-4">
            <TouchableOpacity
              className="bg-red-500 p-5 rounded-3xl flex-row items-center justify-center mb-4"
              onPress={ejecutarEliminacion}
            >
              <Trash2 size={20} color="white" className="mr-2" />
              <Text className="text-white font-black text-base ml-2">SÍ, ELIMINAR</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`${isDarkMode ? 'bg-dark-card border-dark-border/40' : 'bg-slate-100 border-slate-200'} p-5 rounded-3xl items-center border`}
              onPress={() => setModalEliminarVisible(false)}
            >
              <Text className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} font-bold text-base`}>Conservar Meta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </BaseLayout>
  );
}
