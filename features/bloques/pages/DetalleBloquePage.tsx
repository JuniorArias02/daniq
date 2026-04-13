import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Plus, ArrowLeft, TrendingDown, Clock, Tag, ShoppingCart, Edit3, Trash2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import BaseLayout from '../../../core/layouts/BaseLayout';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';
import ModalCrearGasto from '../../gastos/components/ModalCrearGasto';
import ModalCrearItemBloque from '../components/ModalCrearItemBloque';
import { formatearCOP } from '../../../core/utils/formatearDinero';
import Modal from 'react-native-modal';
import { BlurView } from 'expo-blur';
import { useDetalleBloque } from '../hooks/useDetalleBloque';

const ICON_MAP: Record<string, any> = { ShoppingCart, Tag };

/**
 * Componente GastoItem: Separado para evitar re-renders y mejorar rendimiento.
 */
const GastoItem = React.memo(({ gasto, onLongPress, themeStyles, isDarkMode }: any) => {
    const CategoryIcon = ICON_MAP[gasto?.categoria_icono] || Tag;
    return (
        <TouchableOpacity 
            delayLongPress={500}
            onLongPress={() => onLongPress(gasto)}
            onPress={() => onLongPress(gasto)}
            activeOpacity={0.7}
            className={`flex-row items-center justify-between ${isDarkMode ? 'bg-dark-card/60' : 'bg-white'} p-5 rounded-3xl mb-3 border ${themeStyles.borderCol} ${!isDarkMode ? 'shadow-sm' : ''}`}
        >
            <View className="flex-row items-center flex-1">
                <View className="w-11 h-11 rounded-xl items-center justify-center mr-4" style={{ backgroundColor: `${gasto?.categoria_color || '#30363D'}20` }}>
                    <CategoryIcon size={20} color={gasto?.categoria_color || (isDarkMode ? '#94A3B8' : '#64748B')} />
                </View>
                <View className="flex-1">
                    <Text className={`${themeStyles.textMain} font-bold text-[15px]`} numberOfLines={1}>{gasto?.descripcion || 'Sin descripción'}</Text>
                    <Text className={`${themeStyles.textSubBold} text-[10px] mt-1 font-bold uppercase tracking-[1px]`}>{gasto?.categoria_nombre || 'Sin Tag'}</Text>
                </View>
            </View>
            <View className="items-end">
                <Text className="text-red-500 font-bold text-[15px]">{formatearCOP(gasto?.monto || 0)}</Text>
                <Text className={`${themeStyles.textSub} text-[9px] mt-1 font-medium`}>{gasto?.fecha || ''}</Text>
            </View>
        </TouchableOpacity>
    );
});

export default function DetalleBloquePage({ id }: { id: string }) {
  const router = useRouter();
  const logic = useDetalleBloque(id);

  const {
      width, height, isDarkMode, bloque, gastos, items, cargando,
      modalGastoVisible, setModalGastoVisible,
      modalItemVisible, setModalItemVisible,
      gastoSeleccionado, setGastoSeleccionado,
      gastoOpcionesVisible, setGastoOpcionesVisible,
      modalEditarGastoVisible, setModalEditarGastoVisible,
      themeStyles, totalPresupuestado, porcentajeProgreso,
      handleLongPressGasto, ejecutarEliminacionGasto, cargarDatos
  } = logic;

  // Estado local para sincronizar el blur con la animación del modal
  const [blurGastoVisible, setBlurGastoVisible] = useState(false);

  if (cargando) {
      return (
        <BaseLayout>
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#22C55E" />
            </View>
        </BaseLayout>
      );
  }

  const renderHeader = () => (
    <View className="mb-6">
      <View className="pt-5 pb-4">
         <View className="flex-row items-center justify-between mb-8">
            <TouchableOpacity onPress={() => router.back()} className={`w-11 h-11 ${isDarkMode ? 'bg-dark-card' : 'bg-white shadow-sm'} items-center justify-center rounded-2xl border ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
                <ArrowLeft size={22} color={isDarkMode ? "#F1F5F9" : "#0F172A"} strokeWidth={1.5} />
            </TouchableOpacity>
            <View className="w-11 h-11 rounded-2xl items-center justify-center border border-brand/20 bg-brand/10" style={{ borderColor: `${bloque?.color || '#22C55E'}40` }}>
                <TrendingDown size={20} color={bloque?.color || '#22C55E'} />
            </View>
         </View>
         <View className="flex-row items-center">
            <Text className={`${themeStyles.textMain} text-3xl font-bold tracking-tight`}>{bloque?.nombre || 'Bargain'}</Text>
            <View className="bg-brand/20 px-2 py-0.5 rounded-full ml-3 border border-brand/30" style={{ borderColor: `${bloque?.color || '#22C55E'}40` }}>
                <Text className="text-brand text-[10px] font-bold uppercase" style={{ color: bloque?.color }}>Activo</Text>
            </View>
         </View>
         <Text className={`${themeStyles.textSubBold} text-[11px] uppercase tracking-widest font-bold mt-1.5 line-clamp-1 italic`}>Gestión de presupuesto por bolsillo</Text>
      </View>

      <Card variant="flat" className={`mt-4 p-6 border ${isDarkMode ? 'border-white/5 bg-dark-card' : 'border-slate-200 bg-white shadow-md'} relative overflow-hidden`}>
          <View className="absolute -top-10 -right-10 w-32 h-32 opacity-10 rounded-full" style={{ backgroundColor: bloque?.color }}/>
          <View className="flex-row justify-between items-center">
              <View>
                  <Text className={`${themeStyles.textSubBold} text-[9px] uppercase font-bold tracking-widest mb-1`}>Total Ejecutado</Text>
                  <Text className={`${themeStyles.textMain} text-4xl font-black tracking-tighter`}>{formatearCOP(bloque?.gastado || 0)}</Text>
              </View>
              <View className="items-end">
                  <Text className="text-brand font-bold text-[9px] uppercase tracking-widest mb-1">Presupuestado</Text>
                  <Text className={`${themeStyles.textSub} font-black text-lg tracking-tighter`}>{formatearCOP(totalPresupuestado)}</Text>
              </View>
          </View>
          <View className="mt-6">
              <View className="h-1.5 w-full bg-slate-500/20 rounded-full overflow-hidden">
                  <View className="h-full bg-brand" style={{ width: `${porcentajeProgreso}%`, backgroundColor: bloque?.color || '#22C55E' }} />
              </View>
          </View>
      </Card>

      <View className="mt-10">
          <View className="flex-row items-center justify-between mb-6">
              <Text className={`${themeStyles.textMain} font-bold text-lg`}>Plan de este bolsillo</Text>
              <TouchableOpacity onPress={() => setModalItemVisible(true)} className="flex-row items-center bg-brand/10 px-3 py-1.5 rounded-xl border border-brand/20" >
                  <Plus size={14} color="#22C55E" strokeWidth={3} />
                  <Text className="text-brand font-bold text-[10px] uppercase ml-1.5 tracking-widest">Añadir Meta</Text>
              </TouchableOpacity>
          </View>
          <View className={`${themeStyles.cardBg} rounded-[32px] p-2 border ${themeStyles.borderCol}`}>
              {(!items || items.length === 0) ? (
                  <View className="py-10 items-center">
                      <ShoppingCart size={24} color={isDarkMode ? "#484F58" : "#94A3B8"} strokeWidth={1.5} />
                      <Text className={`${themeStyles.textSub} text-[11px] mt-2 italic`}>Sin metas planificadas aún.</Text>
                  </View>
              ) : items.map((item) => (
                  <View key={item.id} className="flex-row items-center justify-between p-4 px-6 border-b border-white/5 last:border-b-0">
                      <View className="flex-row items-center flex-1">
                          <View className="w-2 h-2 rounded-full mr-4" style={{ backgroundColor: bloque?.color }} />
                          <Text className={`${themeStyles.textMain} font-bold text-[13px]`} numberOfLines={1}>{item.nombre}</Text>
                      </View>
                      <View className="flex-row items-center">
                          <Text className={`${themeStyles.textSub} font-bold text-[13px] mr-4`}>{formatearCOP(item.precio)}</Text>
                      </View>
                  </View>
              ))}
          </View>
      </View>
      <Text className={`${themeStyles.textMain} font-bold text-lg mb-6 mt-10`}>Movimientos de este bolsillo</Text>
    </View>
  );

  const renderEmptyGasto = () => (
    <View className={`py-20 items-center justify-center ${isDarkMode ? 'bg-dark-card/20' : 'bg-slate-50'} rounded-[32px] border border-dashed ${themeStyles.borderCol}`}>
        <Clock size={40} color={isDarkMode ? "#484F58" : "#CBD5E1"} strokeWidth={1} />
        <Text className={`${themeStyles.textSub} mt-4 text-center px-10 italic font-medium`}>No hay gastos todavía.</Text>
    </View>
  );

  return (
    <BaseLayout>
      <FlatList
        data={gastos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
            <GastoItem gasto={item} onLongPress={handleLongPressGasto} themeStyles={themeStyles} isDarkMode={isDarkMode} />
        )}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={<View style={{ height: 100 }} />}
        ListEmptyComponent={renderEmptyGasto}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      />

      <Button variant="fab" Icono={Plus} onPress={() => setModalGastoVisible(true)} />

      {/* Blur sincronizado: aparece con onModalWillShow y desaparece con onModalHide */}
      {blurGastoVisible && (
        <TouchableWithoutFeedback onPress={() => { setGastoOpcionesVisible(false); setGastoSeleccionado(null); }}>
          <BlurView
            intensity={60}
            tint={isDarkMode ? 'dark' : 'light'}
            experimentalBlurMethod="dimezisBlurView"
            style={[StyleSheet.absoluteFill, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.55)' : 'rgba(15,23,42,0.4)' }]}
          />
        </TouchableWithoutFeedback>
      )}

      <ModalCrearGasto visible={modalGastoVisible} onClose={() => setModalGastoVisible(false)} onSave={() => cargarDatos()} initialBloqueId={parseInt(id)} />

      <Modal 
        isVisible={gastoOpcionesVisible} 
        onBackdropPress={() => { setGastoOpcionesVisible(false); setGastoSeleccionado(null); }} 
        backdropOpacity={0}
        animationIn="fadeIn"
        animationOut="fadeOut"
        animationInTiming={250}
        animationOutTiming={250}
        onModalWillShow={() => setBlurGastoVisible(true)}
        onModalHide={() => { setBlurGastoVisible(false); setGastoSeleccionado(null); }}
        onModalShow={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)} 
        style={{ margin: 0, justifyContent: 'center', alignItems: 'center' }} 
      >
        <View className="w-full px-10">
            {gastoSeleccionado && (
                <View className={`${isDarkMode ? 'bg-dark-card border-brand/20' : 'bg-white border-slate-100'} p-6 rounded-3xl border-2 shadow-2xl mb-8`}>
                    <View className="flex-row items-center w-full">
                        <View className="w-11 h-11 rounded-xl items-center justify-center mr-4" style={{ backgroundColor: `${gastoSeleccionado.categoria_color || '#30363D'}20` }}>
                             <Tag size={20} color={gastoSeleccionado.categoria_color || (isDarkMode ? '#94A3B8' : '#64748B')} />
                        </View>
                        <View className="flex-1">
                            <Text className={`${themeStyles.textMain} font-bold text-[15px]`} numberOfLines={1}>{gastoSeleccionado.descripcion || 'Sin descripción'}</Text>
                            <Text className="text-red-500 font-bold text-[13px]">{formatearCOP(gastoSeleccionado.monto || 0)}</Text>
                        </View>
                    </View>
                </View>
            )}
            <View className="flex-row justify-between space-x-4">
                <TouchableOpacity className={`${isDarkMode ? 'bg-dark-card' : 'bg-white'} flex-1 p-6 rounded-[35px] items-center justify-center border shadow-2xl ${isDarkMode ? 'border-brand/20' : 'border-slate-100'}`} onPress={() => { setGastoOpcionesVisible(false); setModalEditarGastoVisible(true); }} >
                    <Edit3 size={24} color="#3B82F6" />
                    <Text className={`${themeStyles.textMain} font-black text-xs tracking-widest mt-2`}>EDITAR</Text>
                </TouchableOpacity>
                <TouchableOpacity className={`${isDarkMode ? 'bg-dark-card' : 'bg-white'} flex-1 p-6 rounded-[35px] items-center justify-center border shadow-2xl ${isDarkMode ? 'border-red-500/20' : 'border-slate-100'}`} onPress={ejecutarEliminacionGasto} >
                    <Trash2 size={24} color="#EF4444" />
                    <Text className={`${themeStyles.textMain} font-black text-xs tracking-widest mt-2`}>ELIMINAR</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity className="mt-12 items-center" onPress={() => { setGastoOpcionesVisible(false); setGastoSeleccionado(null); }} >
                <Text className="text-white opacity-40 font-bold tracking-[4px] text-[10px] uppercase">Tap para cancelar</Text>
            </TouchableOpacity>
        </View>
      </Modal>

      <ModalCrearGasto visible={modalEditarGastoVisible} onClose={() => setModalEditarGastoVisible(false)} onSave={() => { cargarDatos(); setGastoSeleccionado(null); }} gastoAEditar={gastoSeleccionado} />

      {/* Modal para crear Metas/Items del bolsillo */}
      <ModalCrearItemBloque 
        visible={modalItemVisible} 
        onClose={() => setModalItemVisible(false)} 
        onSave={() => cargarDatos()} 
        bloqueId={parseInt(id)} 
      />
    </BaseLayout>
  );
}
