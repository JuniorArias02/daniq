import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { PieChart, TrendingUp, TrendingDown, Wallet, Tag, Layers, ArrowDownRight, Info, Menu } from 'lucide-react-native';
import { useFocusEffect, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import BaseLayout from '../../../core/layouts/BaseLayout';
import Card from '../../../shared/components/Card';
import { obtenerUsuarioPrincipal } from '../../usuario/services/usuarioService';
import { obtenerResumenBalance, obtenerDistribucionCategorias, obtenerDistribucionBolsillos } from '../services/reporteService';
import { formatearCOP } from '../../../core/utils/formatearDinero';
import { useTheme } from '../../../core/contexts/ThemeContext';

const { width } = Dimensions.get('window');

/**
 * ReportesPage: El cerebro visual de Daniq.
 */
export default function ReportesPage() {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const [balance, setBalance] = useState({ totalIngresos: 0, totalGastos: 0, balance: 0 });
  const [categorias, setCategorias] = useState<any[]>([]);
  const [bolsillos, setBolsillos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  // Colores Dinámicos
  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSub = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const textSubBold = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  const handleOpenDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const cargarEstadisticas = useCallback(async () => {
    try {
      const user = await obtenerUsuarioPrincipal();
      if (user) {
        const [resBalance, resCats, resBolsillos] = await Promise.all([
          obtenerResumenBalance(user.id),
          obtenerDistribucionCategorias(user.id),
          obtenerDistribucionBolsillos(user.id)
        ]);
        setBalance(resBalance);
        setCategorias(resCats);
        setBolsillos(resBolsillos);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarEstadisticas();
    }, [cargarEstadisticas])
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

  const totalGasto = balance.totalGastos || 1;
  const metaAhorro = balance.totalIngresos > 0 ? ((balance.balance / balance.totalIngresos) * 100).toFixed(1) : '0';

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
              <Text className={`${textMain} text-2xl font-bold tracking-tight`}>Analítica</Text>
              <View className="bg-brand/20 px-2 py-0.5 rounded-full ml-3 border border-brand/30">
                <Text className="text-brand text-[10px] font-bold uppercase">En Vivo</Text>
              </View>
            </View>
            <Text className={`${textSubBold} text-[11px] uppercase tracking-widest font-bold mt-0.5`}>Gestión financiera en tiempo real</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        
        {/* Balance General Card */}
        <Card variant="default" className="mt-4 overflow-hidden">
            <View className="flex-row items-center justify-between mb-6">
                <View className="p-3 bg-brand/10 rounded-2xl">
                    <Wallet size={24} color="#22C55E" />
                </View>
                <View className="flex-row items-center px-3 py-1 bg-brand/10 rounded-full border border-brand/20">
                     <Text className="text-brand text-[10px] font-bold uppercase tracking-widest">{metaAhorro}% ahorrado</Text>
                </View>
            </View>
            
            <Text className={`${textSubBold} font-bold uppercase tracking-widest text-[10px]`}>Tu Balance Actual</Text>
            <Text className={`text-5xl font-bold mt-2 tracking-tighter ${balance.balance < 0 ? 'text-red-500' : textMain}`}>
                {formatearCOP(balance.balance)}
            </Text>
            
            <View className={`flex-row mt-10 justify-between items-center border-t ${isDarkMode ? 'border-dark-border/20' : 'border-slate-100'} pt-6`}>
                <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-blue-500/10 items-center justify-center rounded-lg mr-3">
                        <TrendingUp size={16} color="#3B82F6" />
                    </View>
                    <View>
                        <Text className={`${textSubBold} text-[9px] font-bold uppercase tracking-widest`}>Ingresos</Text>
                        <Text className={`${textMain} font-bold text-xs`}>{formatearCOP(balance.totalIngresos)}</Text>
                    </View>
                </View>
                <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-red-500/10 items-center justify-center rounded-lg mr-3">
                        <TrendingDown size={16} color="#EF4444" />
                    </View>
                    <View>
                        <Text className={`${textSubBold} text-[9px] font-bold uppercase tracking-widest`}>Gastos</Text>
                        <Text className={`${textMain} font-bold text-xs`}>{formatearCOP(balance.totalGastos)}</Text>
                    </View>
                </View>
            </View>
        </Card>

        {/* Sección: Distribución por Categoría */}
        <View className="mt-10">
            <View className="flex-row items-center justify-between mb-8">
                <View className="flex-row items-center">
                    <Tag size={18} color="#3B82F6" />
                    <Text className={`${textMain} font-bold text-lg ml-3`}>¿En qué se va la plata?</Text>
                </View>
                <TouchableOpacity className={`p-2 ${isDarkMode ? 'bg-dark-card' : 'bg-slate-100'} rounded-lg`}>
                    <Info size={16} color={isDarkMode ? "#484F58" : "#94A3B8"} />
                </TouchableOpacity>
            </View>

            {categorias.length === 0 ? (
                <View className={`p-10 border border-dashed ${isDarkMode ? 'border-dark-border' : 'border-slate-300'} rounded-3xl items-center`}>
                    <Text className="text-slate-500 italic text-center">Registra gastos para ver el mapa de etiquetas.</Text>
                </View>
            ) : (
                <View>
                    {categorias.map((cat, idx) => {
                        const widthPct = (cat.total / totalGasto) * 100;
                        return (
                            <View key={idx} className="mb-6">
                                <View className="flex-row justify-between items-center mb-3">
                                    <View className="flex-row items-center">
                                        <View className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: cat.color || '#3B82F6' }} />
                                        <Text className={`${textSub} font-bold text-[13px]`}>{cat.label}</Text>
                                    </View>
                                    <Text className={`${textMain} font-bold text-xs`}>{formatearCOP(cat.total)}</Text>
                                </View>
                                <View className={`h-2 ${isDarkMode ? 'bg-dark-card' : 'bg-slate-100'} rounded-full overflow-hidden`}>
                                     <View 
                                        className="h-full rounded-full" 
                                        style={{ 
                                            backgroundColor: cat.color || '#3B82F6', 
                                            width: `${widthPct}%` 
                                        }} 
                                     />
                                </View>
                                <Text className="text-slate-500 text-[9px] mt-2 text-right font-bold">{widthPct.toFixed(1)}% del total</Text>
                            </View>
                        );
                    })}
                </View>
            )}
        </View>

        {/* Sección: Rendimiento por Bolsillos */}
        <View className="mt-10 mb-20">
             <View className="flex-row items-center mb-8">
                <Layers size={18} color="#22C55E" />
                <Text className={`${textMain} font-bold text-lg ml-3`}>Flujo por Bolsillos</Text>
            </View>

            <View className="flex-row flex-wrap justify-between">
                {bolsillos.length === 0 ? (
                    <Text className={`${textSub} italic px-4`}>No hay datos de bolsillos.</Text>
                ) : bolsillos.map((bol, idx) => (
                    <View key={idx} className="w-[48%] mb-4">
                        <Card variant="flat" className="p-4 min-h-[100px] justify-between">
                             <Text className={`${textSubBold} text-[10px] font-bold uppercase tracking-widest`}>{bol.label}</Text>
                             <View className="mt-3">
                                  <Text className={`${textMain} font-bold text-[15px]`}>{formatearCOP(bol.total)}</Text>
                                  <View className="flex-row items-center mt-1">
                                      <ArrowDownRight size={12} color="#EF4444" />
                                      <Text className="text-red-500 text-[10px] font-bold ml-1">Salida</Text>
                                  </View>
                             </View>
                        </Card>
                    </View>
                ))}
            </View>
        </View>
      </ScrollView>
    </BaseLayout>
  );
}
