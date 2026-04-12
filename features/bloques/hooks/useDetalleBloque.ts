import { useState, useCallback, useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { obtenerDetalleBloque } from '../services/bloqueService';
import { obtenerPorBloque, eliminarGasto } from '../../gastos/services/gastoService';
import { itemBloqueService } from '../services/itemBloqueService';
import { useTheme } from '../../../core/contexts/ThemeContext';

export function useDetalleBloque(id: string) {
  const { isDarkMode } = useTheme();
  const { width, height } = useWindowDimensions();
  
  // Estado local
  const [bloque, setBloque] = useState<any>(null);
  const [gastos, setGastos] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  
  // Estados para Modales
  const [modalGastoVisible, setModalGastoVisible] = useState(false);
  const [modalItemVisible, setModalItemVisible] = useState(false);
  const [gastoSeleccionado, setGastoSeleccionado] = useState<any>(null);
  const [gastoOpcionesVisible, setGastoOpcionesVisible] = useState(false);
  const [modalEditarGastoVisible, setModalEditarGastoVisible] = useState(false);

  // 1. Memoización de Estilos del Tema
  const themeStyles = useMemo(() => ({
    textMain: isDarkMode ? 'text-white' : 'text-slate-900',
    textSub: isDarkMode ? 'text-slate-400' : 'text-slate-600',
    textSubBold: isDarkMode ? 'text-slate-400' : 'text-slate-500',
    cardBg: isDarkMode ? 'bg-dark-card' : 'bg-slate-50',
    borderCol: isDarkMode ? 'border-dark-border/40' : 'border-slate-200',
  }), [isDarkMode]);

  // 2. Memoización de Cálculos
  const totalPresupuestado = useMemo(() => 
    items.reduce((acc, curr) => acc + curr.precio, 0), 
  [items]);

  const porcentajeProgreso = useMemo(() => {
    const total = totalPresupuestado || 1;
    return Math.min(100, ((bloque?.gastado || 0) / total) * 100);
  }, [bloque?.gastado, totalPresupuestado]);

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

  const handleLongPressGasto = useCallback((gasto: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setGastoSeleccionado(gasto);
    setGastoOpcionesVisible(true);
  }, []);

  const ejecutarEliminacionGasto = useCallback(async () => {
    if (gastoSeleccionado) {
       await eliminarGasto(gastoSeleccionado.id);
       setGastoOpcionesVisible(false);
       setGastoSeleccionado(null);
       cargarDatos();
    }
  }, [gastoSeleccionado, cargarDatos]);

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [cargarDatos])
  );

  return {
      width,
      height,
      isDarkMode,
      bloque,
      gastos,
      items,
      cargando,
      modalGastoVisible,
      setModalGastoVisible,
      modalItemVisible,
      setModalItemVisible,
      gastoSeleccionado,
      setGastoSeleccionado,
      gastoOpcionesVisible,
      setGastoOpcionesVisible,
      modalEditarGastoVisible,
      setModalEditarGastoVisible,
      themeStyles,
      totalPresupuestado,
      porcentajeProgreso,
      handleLongPressGasto,
      ejecutarEliminacionGasto,
      cargarDatos
  };
}
