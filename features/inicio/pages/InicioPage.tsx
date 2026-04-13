import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { MessageCircle, Plus, Briefcase, ShoppingCart, Wine, ArrowUp, ArrowDown, Menu, TrendingUp } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

// Core & Shared components
import BaseLayout from '../../../core/layouts/BaseLayout';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';

import { obtenerUsuarioPrincipal } from '../../usuario/services/usuarioService';
import { formatearCOP } from '../../../core/utils/formatearDinero';
import { useTheme } from '../../../core/contexts/ThemeContext';

const MOCK_MOVIMIENTOS = [
  { id: '1', titulo: 'Sueldo', subtitulo: 'Pago Quincenal', monto: 2500000, tipo: 'ingreso', icono: Briefcase },
  { id: '2', titulo: 'Supermercado', subtitulo: 'Olimpica / Exito', monto: 450000, tipo: 'gasto', icono: ShoppingCart },
  { id: '3', titulo: 'Cena con Amigos', subtitulo: 'Parrilla La 70', monto: 120000, tipo: 'gasto', icono: Wine },
];

import ModalCrearGasto from '../../gastos/components/ModalCrearGasto';
import ModalCrearIngreso from '../../ingresos/components/ModalCrearIngreso';
import { obtenerUltimosMovimientos, obtenerTotalGastos } from '../../gastos/services/gastoService';
import { obtenerTotalIngresos, obtenerIngresosPorUsuario } from '../../ingresos/services/ingresoService';
import { obtenerAnaliticaMensual } from '../../reportes/services/reporteService';

import { useFocusEffect } from '@react-navigation/native';
import { obtenerMensajeWidget, MensajeCoach } from '../../coach/utils/evaluadorReglas';
import CoachWidget from '../../coach/components/CoachWidget';

export default function InicioPage() {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const [nombreUsuario, setNombreUsuario] = React.useState('...');
  


  const [movimientos, setMovimientos] = React.useState<any[]>([]);
  const [totalIngresos, setTotalIngresos] = React.useState(0);
  const [totalGastos, setTotalGastos] = React.useState(0);
  const [statsMensuales, setStatsMensuales] = React.useState<any[]>([]);
  
  const [gastoModalVisible, setGastoModalVisible] = React.useState(false);
  const [ingresoModalVisible, setIngresoModalVisible] = React.useState(false);
  const [ingresoAEditar, setIngresoAEditar] = React.useState<any | null>(null);
  const [ingresos, setIngresos] = React.useState<any[]>([]);
  const [cargando, setCargando] = React.useState(true);
  const [mensajeCoach, setMensajeCoach] = React.useState<MensajeCoach | null>(null);

  // Colores Dinámicos Estabilizados
  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSub = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const textSubBold = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const cardBg = isDarkMode ? 'bg-dark-card' : 'bg-white';
  const borderCol = isDarkMode ? 'border-dark-border/20' : 'border-slate-100';
  const statsCardBg = isDarkMode ? 'bg-dark-card/20' : 'bg-slate-100';

  const handleOpenDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const cargarDatosGlobales = React.useCallback(async () => {
    const user = await obtenerUsuarioPrincipal();
    if (user) {
      setNombreUsuario(user.nombre);
      
      const [movs, tIngresos, tGastos, stats, listIngresos] = await Promise.all([
        obtenerUltimosMovimientos(user.id),
        obtenerTotalIngresos(user.id),
        obtenerTotalGastos(user.id),
        obtenerAnaliticaMensual(user.id),
        obtenerIngresosPorUsuario(user.id)
      ]);
      
      setMovimientos(movs || []);
      setTotalIngresos(tIngresos || 0);
      setTotalGastos(tGastos || 0);
      setStatsMensuales(stats || []);
      setIngresos(listIngresos || []);

      // Generar Widget Financiero Diariamente
      let diasSinGastar = 15; // Por defecto asumimos inactividad
      if (movs && movs.length > 0) {
         try {
           const fechaUltimoGasto = movs[0].fecha;
           const tzDate = new Date(fechaUltimoGasto);
           const currentTime = new Date();
           const diffTime = Math.abs(currentTime.getTime() - tzDate.getTime());
           diasSinGastar = Math.floor(diffTime / (1000 * 60 * 60 * 24));
         } catch {
           diasSinGastar = 3;
         }
      }

      setMensajeCoach(obtenerMensajeWidget({
          totalGastosMesp: tGastos || 0,
          totalIngresosMesp: tIngresos || 0,
          conteoGastosPequenos: 0,
          diasSinGastar
      }));
    }
    setCargando(false);
  }, []);

  // Recargar datos cada vez que la pestaña Inicio gana el foco
  useFocusEffect(
    React.useCallback(() => {
      cargarDatosGlobales();
    }, [cargarDatosGlobales])
  );

  const saldoDisponible = totalIngresos - totalGastos;

  return (
    <BaseLayout>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-5 mt-2">
        <View className="flex-row items-center">
            <TouchableOpacity onPress={handleOpenDrawer} className="mr-4 p-1">
                <Menu size={28} color={isDarkMode ? "#F1F5F9" : "#0F172A"} strokeWidth={1.5} />
            </TouchableOpacity>
            <View>
                <Text className={`${textMain} text-2xl font-bold tracking-tight`}>Hola, {nombreUsuario}</Text>
                <Text className={`${textSubBold} text-[11px] uppercase tracking-widest font-bold`}>Resumen Mensual (COP)</Text>
            </View>
        </View>
        <Button variant="icon" Icono={MessageCircle} />
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Card Saldo Principal */}
        <Card className="mt-3" variant="default">
          <Text className={`${textSub} text-sm font-medium`}>Saldo Disponible</Text>
          <Text className={`${textMain} text-[34px] leading-[48px] font-bold mt-2 mb-6 tracking-tight`}>
            {formatearCOP(saldoDisponible)}
          </Text>
          
          <View className={`flex-row items-center border-t ${isDarkMode ? 'border-dark-border/40' : 'border-slate-100'} pt-5`}>
            <View className="flex-row items-center flex-1">
              <TouchableOpacity 
                onPress={() => setIngresoModalVisible(true)}
                className="bg-brand/10 w-8 h-8 rounded-full items-center justify-center mr-2 border border-brand/20"
              >
                <Plus size={14} color="#22C55E" strokeWidth={3} />
              </TouchableOpacity>
              <View>
                  <Text className={`${textSubBold} text-[10px] uppercase font-bold tracking-widest`}>Ingresos</Text>
                  <Text className={`${textMain} font-bold`}>{formatearCOP(totalIngresos)}</Text>
              </View>
            </View>

            <View className={`w-px h-6 ${isDarkMode ? 'bg-dark-border' : 'bg-slate-200'} mx-3`} />

            <View className="flex-row items-center flex-1 justify-end">
               <View className="mr-2 items-end">
                  <Text className={`${textSubBold} text-[10px] uppercase font-bold tracking-widest`}>Gastos</Text>
                  <Text className="text-red-500 font-bold">{formatearCOP(totalGastos)}</Text>
              </View>
              <ArrowDown size={16} color="#EF4444" strokeWidth={3} />
            </View>
          </View>
        </Card>

        {/* Notificación AI Diaria (Coach Widget) */}
        <View className="mt-8">
            <CoachWidget mensajeObj={mensajeCoach} />
        </View>

        {/* Sección de Movimientos */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-5">
            <Text className={`${textMain} text-[17px] font-bold`}>Últimos Movimientos</Text>
            <TouchableOpacity onPress={() => cargarDatosGlobales()}>
              <Text className="text-brand text-sm font-semibold">Actualizar {'>'}</Text>
            </TouchableOpacity>
          </View>

          {/* Lista de Movimientos Dinámica */}
          {movimientos.length === 0 ? (
            <View className={`py-10 items-center justify-center ${statsCardBg} rounded-3xl border border-dashed border-dark-border`}>
                <Text className="text-slate-500 text-xs text-center px-10 leading-5 italic">No hay registros de dinero todavía. Toca el botón de (+) para anotar tu primer gasto o ingreso.</Text>
            </View>
          ) : movimientos.map((movimiento) => {
            return (
              <View key={movimiento.id} className={`flex-row items-center justify-between ${cardBg} p-[18px] rounded-2xl mb-3 border ${borderCol} shadow-sm`}>
                <View className="flex-row items-center">
                  <View 
                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4" 
                    style={{ backgroundColor: `${movimiento.bloque_color || '#22C55E'}20` }}
                  >
                    <Briefcase size={22} color={movimiento.bloque_color || '#94A3B8'} />
                  </View>
                  <View>
                    <Text className={`${textMain} font-bold text-[15px]`}>{movimiento.descripcion}</Text>
                    <Text className="text-xs mt-1 uppercase tracking-widest font-bold" style={{ color: movimiento.bloque_color || (isDarkMode ? '#94A3B8' : '#64748B') }}>{movimiento.bloque_nombre || 'General'}</Text>
                  </View>
                </View>
                <Text className="font-bold text-[14px] text-red-500">
                  − {formatearCOP(movimiento.monto)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Sección de Ingresos Editables */}
        <View className="mt-2 mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className={`${textMain} text-[17px] font-bold`}>Mis Ingresos</Text>
            <TouchableOpacity onPress={() => { setIngresoAEditar(null); setIngresoModalVisible(true); }}>
              <Text className="text-brand text-sm font-semibold">+ Nuevo</Text>
            </TouchableOpacity>
          </View>

          {ingresos.length === 0 ? (
            <View className={`py-8 items-center justify-center ${statsCardBg} rounded-3xl border border-dashed ${borderCol}`}>
              <Text className={`${textSub} text-xs text-center px-10 italic`}>Aún no has registrado ingresos.</Text>
            </View>
          ) : ingresos.map((ingreso) => (
            <TouchableOpacity
              key={ingreso.id}
              onPress={() => { setIngresoAEditar(ingreso); setIngresoModalVisible(true); }}
              activeOpacity={0.75}
              className={`flex-row items-center justify-between ${cardBg} p-[18px] rounded-2xl mb-3 border ${borderCol}`}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 rounded-2xl items-center justify-center mr-4 bg-brand/10">
                  <TrendingUp size={20} color="#22C55E" />
                </View>
                <View className="flex-1">
                  <Text className={`${textMain} font-bold text-[15px]`} numberOfLines={1}>{ingreso.descripcion}</Text>
                  <Text className={`${textSub} text-[10px] mt-0.5 font-medium`}>{ingreso.fecha}</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="font-bold text-[14px] text-brand">+ {formatearCOP(ingreso.monto)}</Text>
                <Text className={`${textSub} text-[9px] mt-0.5 uppercase tracking-widest`}>Toca para editar</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Estadísticas */}
        <View className="mb-4">
          <Text className={`${textMain} text-[17px] font-bold mb-4`}>Estadísticas</Text>
          <View className="flex-row justify-between mb-8">
            {/* Ingresos Card */}
            <Card variant="flat" className="flex-1 mr-2 p-5 w-auto">
              <Text className={`${textSubBold} font-bold text-[10px] uppercase tracking-widest mb-1 text-center`}>Ingresos</Text>
              <Text className="text-brand text-lg font-bold mb-6 text-center">{formatearCOP(totalIngresos)}</Text>
              
              <View className="flex-row items-end justify-between h-14 w-full mt-2 px-1">
                {statsMensuales.length > 0 ? (
                  statsMensuales.map((stat, i) => {
                    const maxIngreso = Math.max(...statsMensuales.map(s => s.ingresos)) || 1;
                    const height = (stat.ingresos / maxIngreso) * 100;
                    return (
                      <View key={i} style={{ height: `${Math.max(height, 5)}%`, width: '12%', backgroundColor: '#22C55E' }} className="rounded-t-sm opacity-90" />
                    );
                  })
                ) : (
                  [30, 45, 60, 85, 50].map((h, i) => (
                    <View key={i} style={{ height: `${h}%`, width: '12%', backgroundColor: '#22C55E' }} className="rounded-t-sm opacity-20" />
                  ))
                )}
              </View>
            </Card>

            {/* Gastos Card */}
            <Card variant="flat" className="flex-1 ml-2 p-5 w-auto">
              <Text className={`${textSubBold} font-bold text-[10px] uppercase tracking-widest mb-1 text-center`}>Gastos</Text>
              <Text className="text-red-500 text-lg font-bold mb-6 text-center">{formatearCOP(totalGastos)}</Text>
              
              <View className="flex-row items-end justify-between h-14 w-full mt-2 px-1">
                {statsMensuales.length > 0 ? (
                  statsMensuales.map((stat, i) => {
                    const maxGasto = Math.max(...statsMensuales.map(s => s.gastos)) || 1;
                    const height = (stat.gastos / maxGasto) * 100;
                    return (
                      <View key={i} style={{ height: `${Math.max(height, 5)}%`, width: '12%', backgroundColor: '#EF4444' }} className="rounded-t-sm opacity-90" />
                    );
                  })
                ) : (
                  [80, 40, 70, 30, 50].map((h, i) => (
                    <View key={i} style={{ height: `${h}%`, width: '12%', backgroundColor: '#EF4444' }} className="rounded-t-sm opacity-20" />
                  ))
                )}
              </View>
            </Card>
          </View>
        </View>
        
        <View className="h-28" />
      </ScrollView>

      <Button 
        variant="fab" 
        Icono={Plus} 
        onPress={() => setGastoModalVisible(true)}
      />

      <ModalCrearGasto 
        visible={gastoModalVisible} 
        onClose={() => setGastoModalVisible(false)} 
        onSave={() => cargarDatosGlobales()} 
      />

      <ModalCrearIngreso 
        visible={ingresoModalVisible} 
        onClose={() => { setIngresoModalVisible(false); setIngresoAEditar(null); }} 
        onSave={() => cargarDatosGlobales()}
        ingresoAEditar={ingresoAEditar}
      />
    </BaseLayout>
  );
}



