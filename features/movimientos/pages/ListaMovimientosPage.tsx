import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ArrowLeft, ArrowDown, ArrowUp, Briefcase, Share2 } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import BaseLayout from '../../../core/layouts/BaseLayout';
import { useTheme } from '../../../core/contexts/ThemeContext';
import { formatearCOP } from '../../../core/utils/formatearDinero';
import { obtenerHistorialMovimientos } from '../services/movimientoService';
import { obtenerUsuarioPrincipal } from '../../usuario/services/usuarioService';
import { exportarMovimientosCSV } from '../services/exportService';

export default function ListaMovimientosPage() {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [exportando, setExportando] = useState(false);

  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSub = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const textSubBold = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const cardBg = isDarkMode ? 'bg-dark-card' : 'bg-white';
  const borderCol = isDarkMode ? 'border-dark-border/20' : 'border-slate-100';

  useEffect(() => {
    cargarMovimientos();
  }, []);

  const cargarMovimientos = async () => {
    setCargando(true);
    try {
      const user = await obtenerUsuarioPrincipal();
      if (user) {
        const data = await obtenerHistorialMovimientos(user.id);
        setMovimientos(data || []);
      }
    } catch (error) {
      console.error("Error al cargar movimientos:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleExportar = async () => {
    if (movimientos.length === 0) {
      Alert.alert("Atención", "No hay movimientos para exportar.");
      return;
    }

    setExportando(true);
    try {
      const user = await obtenerUsuarioPrincipal();
      if (user) {
        await exportarMovimientosCSV(user.id);
      }
    } catch (error: any) {
      Alert.alert("Error al exportar", error.message || "Hubo un problema al generar el archivo.");
    } finally {
      setExportando(false);
    }
  };

  const formatearFecha = (fechaStr: string) => {
    if (!fechaStr) return '';
    try {
      const date = new Date(fechaStr + 'T00:00:00'); // Tratar como hora local
      return date.toLocaleDateString('es-CO', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return fechaStr;
    }
  };

  return (
    <BaseLayout edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-5 mt-2 border-b border-dark-border/10">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            className="mr-4 p-2 bg-slate-200 dark:bg-dark-card rounded-full"
          >
            <ArrowLeft size={20} color={isDarkMode ? "#F1F5F9" : "#0F172A"} strokeWidth={2} />
          </TouchableOpacity>
          <View>
            <Text className={`${textMain} text-xl font-bold tracking-tight`}>Historial Completo</Text>
            <Text className={`${textSubBold} text-[11px] uppercase tracking-widest font-bold`}>Todos tus movimientos</Text>
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleExportar}
          disabled={exportando}
          className={`p-3 ${isDarkMode ? 'bg-dark-card' : 'bg-slate-100'} rounded-2xl active:bg-brand/10`}
        >
          {exportando ? (
            <ActivityIndicator size="small" color="#22C55E" />
          ) : (
            <Share2 size={20} color="#22C55E" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {cargando ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#22C55E" />
            <Text className={`${textSub} mt-4 font-medium`}>Cargando historial...</Text>
          </View>
        ) : movimientos.length === 0 ? (
          <View className={`py-12 mt-6 items-center justify-center ${isDarkMode ? 'bg-dark-card/20' : 'bg-slate-100'} rounded-3xl border border-dashed border-dark-border`}>
            <Text className={`${textSub} text-sm text-center px-10 leading-5 italic`}>
              No hay registros de dinero todavía.
            </Text>
          </View>
        ) : (
          <View className="mb-20">
            {movimientos.map((movimiento, index) => {
              const esIngreso = movimiento.tipo_movimiento === 'ingreso';
              const iconoColor = esIngreso ? '#22C55E' : (movimiento.bloque_color || '#EF4444');
              const IconoComponente = esIngreso ? ArrowUp : Briefcase;
              
              const montoColor = esIngreso ? 'text-green-500' : 'text-red-500';
              const montoSigo = esIngreso ? '+' : '−';

              return (
                <View key={`${movimiento.tipo_movimiento}-${movimiento.id}-${index}`} className={`flex-row items-center justify-between ${cardBg} p-[18px] rounded-2xl mb-3 border ${borderCol} shadow-sm`}>
                  <View className="flex-row items-center flex-1 pr-4">
                    <View 
                      className="w-12 h-12 rounded-2xl items-center justify-center mr-4" 
                      style={{ backgroundColor: `${iconoColor}20` }}
                    >
                      <IconoComponente size={22} color={iconoColor} strokeWidth={2.5} />
                    </View>
                    <View className="flex-1">
                      <Text className={`${textMain} font-bold text-[15px]`} numberOfLines={1}>
                        {movimiento.descripcion}
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <Text className="text-[10px] uppercase tracking-widest font-bold" style={{ color: iconoColor }}>
                          {movimiento.bloque_nombre || (esIngreso ? 'Ingreso' : 'Gastos')}
                        </Text>
                        <Text className={`text-[10px] ml-2 ${textSub}`}>
                          • {formatearFecha(movimiento.fecha)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text className={`font-bold text-[15px] ${montoColor}`}>
                    {montoSigo} {formatearCOP(movimiento.monto)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </BaseLayout>
  );
}
