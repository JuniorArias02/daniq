import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Plus, Tag, Trash2, ArrowLeft, ShoppingCart, Utensils, Zap, Bus, Coffee, Heart, Briefcase, Car, Home } from 'lucide-react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import BaseLayout from '../../../core/layouts/BaseLayout';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';
import { listarCategorias, crearCategoria, eliminarCategoria } from '../services/categoriaService';
import ModalCrearCategoria from '../components/ModalCrearCategoria';
import ModalConfirmacion from '../../../shared/components/ModalConfirmacion';
import { useTheme } from '../../../core/contexts/ThemeContext';

// Mapa de iconos disponibles para renderizado dinámico
const ICON_MAP: Record<string, any> = {
  ShoppingCart, Utensils, Zap, Bus, Coffee, Heart, Briefcase, Car, Home
};

export default function CategoriasPage() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [categorias, setCategorias] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Estado para el Modal de Confirmación
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [catParaEliminar, setCatParaEliminar] = useState<{id: number, nombre: string} | null>(null);

  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSub = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const textSubBold = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const cardBg = isDarkMode ? 'bg-dark-card' : 'bg-slate-50';
  const borderCol = isDarkMode ? 'border-dark-border/40' : 'border-slate-200';

  const cargarDatos = useCallback(async () => {
    try {
      const data = await listarCategorias();
      setCategorias(data);
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [cargarDatos])
  );

  const handleCrear = async (nombre: string, icono: string, color: string) => {
    await crearCategoria(nombre, icono, color);
    cargarDatos();
  };

  const handleEliminar = (id: number, nombre: string) => {
    setCatParaEliminar({ id, nombre });
    setModalConfirmVisible(true);
  };

  const confirmarEliminar = async () => {
    if (catParaEliminar) {
       await eliminarCategoria(catParaEliminar.id);
       cargarDatos();
    }
  };

  return (
    <BaseLayout>
      {/* Header Personalizado con botón atrás */}
      <View className="flex-row items-center justify-between px-6 py-5 mt-2">
        <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className={`mr-4 p-2 ${isDarkMode ? 'bg-dark-card' : 'bg-slate-100'} rounded-xl border ${borderCol}`}>
                <ArrowLeft size={18} color={isDarkMode ? "#94A3B8" : "#475569"} />
            </TouchableOpacity>
            <View>
                <Text className={`${textMain} text-2xl font-bold tracking-tight`}>Categorías</Text>
                <Text className={`${textSubBold} text-[11px] font-bold uppercase tracking-widest mt-1`}>Gasto por Etiquetas</Text>
            </View>
        </View>
        <Button variant="icon" Icono={Plus} onPress={() => setModalVisible(true)} />
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {cargando ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#22C55E" />
          </View>
        ) : categorias.length === 0 ? (
          <View className={`items-center justify-center py-24 ${isDarkMode ? 'bg-dark-card/20' : 'bg-slate-100'} rounded-[32px] border border-dashed ${borderCol} mt-4`}>
             <Tag size={48} color={isDarkMode ? "#484F58" : "#CBD5E1"} strokeWidth={1} />
             <Text className={`${textSub} mt-5 font-medium text-center px-10 leading-5`}>No has definido categorías para tus gastos. Estos sirven para filtrar reportes luego.</Text>
             <TouchableOpacity 
                onPress={() => setModalVisible(true)}
                className="mt-8 bg-brand/10 px-6 py-3 rounded-xl border border-brand/20"
             >
                <Text className="text-brand font-bold uppercase tracking-widest text-[11px]">Crear Categoría</Text>
             </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between pt-2">
            {categorias.map((cat) => {
              const IconoComponente = ICON_MAP[cat.icono] || Tag;
              return (
                <TouchableOpacity 
                  key={cat.id} 
                  className="w-[48%] mb-4"
                  onLongPress={() => handleEliminar(cat.id, cat.nombre)}
                >
                  <Card variant="flat" className={`p-5 border ${borderCol} relative overflow-hidden items-center justify-center`}>
                     {/* Borde de color lateral */}
                     <View className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: cat.color || '#22C55E' }} />
                     
                     <View className="w-14 h-14 rounded-2xl items-center justify-center mb-4" style={{ backgroundColor: `${cat.color || '#22C55E'}20` }}>
                        <IconoComponente size={26} color={cat.color || '#22C55E'} strokeWidth={1.5} />
                     </View>
 
                     <Text className={`${textMain} font-bold text-[15px] mb-1 text-center`} numberOfLines={1}>{cat.nombre}</Text>
                     <Text className={`${textSubBold} text-[9px] uppercase font-bold tracking-widest mt-1`}>Ver Reporte</Text>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View className="h-20" />
      </ScrollView>

      {/* Formulario Modal */}
      <ModalCrearCategoria 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        onSave={handleCrear} 
      />

      {/* Modal Premium de Confirmación */}
      <ModalConfirmacion
        visible={modalConfirmVisible}
        onClose={() => setModalConfirmVisible(false)}
        onConfirm={confirmarEliminar}
        titulo="¿Eliminar Categoría?"
        mensaje={`Esta acción borrará la categoría "${catParaEliminar?.nombre}" y no podrás deshacerlo. ¿Deseas continuar?`}
      />
    </BaseLayout>
  );
}
