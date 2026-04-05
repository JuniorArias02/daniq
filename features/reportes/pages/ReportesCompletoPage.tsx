import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, TrendingUp, TrendingDown, Calendar, 
  ChevronRight, BarChart3, Info 
} from 'lucide-react-native';
import { BarChart } from 'react-native-chart-kit';
import BaseLayout from '../../../core/layouts/BaseLayout';
import { obtenerUsuarioPrincipal } from '../../usuario/services/usuarioService';
import { obtenerAnaliticaMensual, obtenerTendenciaAhorro } from '../services/reporteService';
import { formatearCOP } from '../../../core/utils/formatearDinero';
import { useTheme } from '../../../core/contexts/ThemeContext';

const { width } = Dimensions.get('window');

/**
 * ReportesCompletoPage: Visión avanzada 360 de las finanzas.
 */
export default function ReportesCompletoPage() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [cargando, setCargando] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [tendencia, setTendencia] = useState({ actual: 0, anterior: 0, diferenciaPercent: 0 });

  // Colores Dinámicos Estabilizados
  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSub = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const textSubBold = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const cardBg = isDarkMode ? 'bg-dark-card' : 'bg-white';
  const borderCol = isDarkMode ? 'border-white/5' : 'border-slate-100';

  useEffect(() => {
    async function cargarReporte() {
      try {
        const user = await obtenerUsuarioPrincipal();
        if (user) {
          setUsuario(user);
          const [analitica, trend] = await Promise.all([
            obtenerAnaliticaMensual(user.id),
            obtenerTendenciaAhorro(user.id)
          ]);

          if (analitica && analitica.length > 0) {
              const labels = analitica.map((item: any) => {
                  const m = item.mes.split('-')[1];
                  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
                  return meses[parseInt(m) - 1] || m;
              });

              setChartData({
                labels: labels,
                datasets: [
                  {
                    data: analitica.map((item: any) => item.gastos),
                    color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
                    strokeWidth: 2
                  }
                ],
                legend: ["Gastos Mensuales"]
              });
          }
          
          setTendencia(trend);
        }
      } catch (e) {
        console.error("Error cargando reportes:", e);
      } finally {
        setCargando(false);
      }
    }
    cargarReporte();
  }, []);

  // Memoizar config para evitar re-renders infinitos en nativewind v4
  const chartConfig = useMemo(() => ({
    backgroundGradientFrom: isDarkMode ? "#15191C" : "#FFFFFF",
    backgroundGradientTo: isDarkMode ? "#15191C" : "#FFFFFF",
    fillShadowGradientFrom: "#22C55E",
    fillShadowGradientTo: isDarkMode ? "#15191C" : "#FFFFFF",
    fillShadowGradientFromOpacity: 0.3,
    color: (opacity = 1) => isDarkMode ? `rgba(34, 197, 94, ${opacity})` : `rgba(34, 197, 94, ${opacity})`,
    labelColor: (opacity = 1) => isDarkMode ? `rgba(148, 163, 184, ${opacity})` : `rgba(71, 85, 105, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.6,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#22C55E"
    }
  }), [isDarkMode]);

  if (cargando) {
      return (
          <BaseLayout className="items-center justify-center">
              <ActivityIndicator size="large" color="#22C55E" />
              <Text className={`${textSubBold} font-bold mt-4`}>Analizando tus movimientos...</Text>
          </BaseLayout>
      );
  }

  return (
    <BaseLayout>
      {/* Header Premium */}
      <View className="flex-row items-center justify-between px-6 py-5 mt-2">
        <View className="flex-row items-center">
           <TouchableOpacity onPress={() => router.back()} className="mr-4 p-1">
             <ArrowLeft size={28} color={isDarkMode ? "#F1F5F9" : "#0F172A"} strokeWidth={1.5} />
           </TouchableOpacity>
           <View>
              <View className="flex-row items-center">
                 <Text className={`${textMain} text-2xl font-bold tracking-tight`}>Análisis</Text>
                 <View className="bg-brand/20 px-2 py-0.5 rounded-full ml-3 border border-brand/30">
                    <Text className="text-brand text-[10px] font-bold uppercase">PRO</Text>
                 </View>
              </View>
              <Text className={`${textSubBold} text-[11px] uppercase tracking-widest font-bold mt-0.5`}>Visión 360 de tus gastos</Text>
           </View>
        </View>
        <View className={`w-11 h-11 rounded-2xl ${isDarkMode ? 'bg-brand/10' : 'bg-brand/5'} items-center justify-center border border-brand/20`}>
           <BarChart3 size={20} color="#20B45C" />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        
        {/* Card de Tendencia Mensual */}
        <View className={`${cardBg} ${borderCol} p-6 rounded-[35px] border mb-8 overflow-hidden ${!isDarkMode ? 'shadow-md' : ''}`}>
           <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center">
                 <Calendar size={18} color={isDarkMode ? "#94A3B8" : "#64748B"} />
                 <Text className={`${textSubBold} font-bold uppercase tracking-widest text-[10px] ml-2`}>Tendencia de Gasto</Text>
              </View>
              <View className={`px-4 py-2 rounded-full border ${tendencia.diferenciaPercent > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'}`}>
                 <Text className={`font-black text-xs ${tendencia.diferenciaPercent > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {tendencia.diferenciaPercent > 0 ? '+' : ''}{tendencia.diferenciaPercent.toFixed(1)}%
                 </Text>
              </View>
           </View>

           <View className="flex-row justify-between items-end">
              <View>
                 <Text className={`${textSubBold} text-xs font-bold mb-1`}>Este Mes</Text>
                 <Text className={`${textMain} text-3xl font-black tracking-tighter`}>{formatearCOP(tendencia.actual)}</Text>
              </View>
              <View className="items-end">
                 <Text className={`${textSubBold} text-[10px] font-bold mb-1`}>Anterior</Text>
                 <Text className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-lg font-bold line-through opacity-40`}>{formatearCOP(tendencia.anterior)}</Text>
              </View>
           </View>

           <View className={`mt-6 flex-row items-center p-4 ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'} rounded-2xl`}>
              <Info size={14} color="#20B45C" />
              <Text className={`${textSub} text-[11px] ml-3 italic flex-1 leading-4`}>
                 {tendencia.diferenciaPercent > 0 
                   ? `¡Ojo ${usuario?.nombre || 'Daniq'}! Has incrementado tus gastos. ¡Revisemos esos antojitos! 🍦` 
                   : `¡Súper ${usuario?.nombre || 'Daniq'}! Estás gastando menos que el mes pasado. ✨`}
              </Text>
           </View>
        </View>

        {/* Gráfica de Barras */}
        <View className={`${cardBg} ${borderCol} p-4 rounded-[35px] border mb-8 items-center overflow-hidden ${!isDarkMode ? 'shadow-md' : ''}`}>
           <View className="w-full px-4 pt-4 mb-4">
               <Text className={`${textMain} text-lg font-black mb-1`}>Histórico de Gastos</Text>
               <Text className={`${textSubBold} text-[10px] uppercase font-bold tracking-widest`}>Análisis por meses</Text>
           </View>
           
           {chartData ? (
               <BarChart
                 data={chartData}
                 width={width - 50}
                 height={220}
                 yAxisLabel="$"
                 yAxisSuffix=""
                 chartConfig={chartConfig}
                 style={{
                   borderRadius: 20,
                   marginTop: 10,
                   paddingRight: 30,
                   marginLeft: -10
                 }}
                 withHorizontalLabels={true}
                 fromZero={true}
                 showValuesOnTopOfBars={true}
               />
           ) : (
               <View className="h-40 items-center justify-center">
                   <Text className="text-slate-500 italic text-xs">No hay datos suficientes para graficar</Text>
               </View>
           )}
        </View>

        {/* Tarjetas de Análisis Rápido */}
        <View className="flex-row justify-between mb-8">
           <TouchableOpacity className={`${cardBg} ${borderCol} p-6 rounded-[30px] border w-[48%] items-center justify-center ${!isDarkMode ? 'shadow-sm' : ''}`}>
              <View className="w-12 h-12 rounded-full bg-brand/10 items-center justify-center mb-3">
                 <TrendingUp size={24} color="#20B45C" />
              </View>
              <Text className={`${textMain} font-bold text-xs`}>Picos Altos</Text>
              <ChevronRight size={14} color={isDarkMode ? "#484F58" : "#94A3B8"} className="mt-2" />
           </TouchableOpacity>

           <TouchableOpacity className={`${cardBg} ${borderCol} p-6 rounded-[30px] border w-[48%] items-center justify-center ${!isDarkMode ? 'shadow-sm' : ''}`}>
              <View className="w-12 h-12 rounded-full bg-red-500/10 items-center justify-center mb-3">
                 <TrendingDown size={24} color="#EF4444" />
              </View>
              <Text className={`${textMain} font-bold text-xs`}>Ahorro Neto</Text>
              <ChevronRight size={14} color={isDarkMode ? "#484F58" : "#94A3B8"} className="mt-2" />
           </TouchableOpacity>
        </View>

        <View className="items-center opacity-30 mt-4 mb-10">
           <Text className={`${textSubBold} text-[10px] font-black uppercase tracking-[5px]`}>Daniq Inteligencia</Text>
        </View>
      </ScrollView>
    </BaseLayout>
  );
}
