import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { X, Check, CreditCard, Layers, Tag, AlignLeft, DollarSign } from 'lucide-react-native';
import Button from '../../../shared/components/Button';
import { listarBloquesUsuario } from '../../bloques/services/bloqueService';
import { listarCategorias } from '../../categorias/services/categoriaService';
import { registrarGasto } from '../services/gastoService';
import { obtenerUsuarioPrincipal } from '../../usuario/services/usuarioService';
import { formatearCOP } from '../../../core/utils/formatearDinero';
import Modal from 'react-native-modal';
import { useTheme } from '../../../core/contexts/ThemeContext';

interface ModalCrearGastoProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  initialBloqueId?: number;
}

/**
 * ModalCrearGasto: Formulario Premium Dinámico para registrar salidas de dinero.
 */
export default function ModalCrearGasto({ visible, onClose, onSave, initialBloqueId }: ModalCrearGastoProps) {
  const { isDarkMode } = useTheme();
  const [monto, setMonto] = useState('0');
  const [descripcion, setDescripcion] = useState('');
  const [bloques, setBloques] = useState<any[]>([]);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<number | null>(initialBloqueId || null);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSub = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const textSubBold = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const cardBg = isDarkMode ? 'bg-dark-card' : 'bg-slate-100';
  const borderCol = isDarkMode ? 'border-dark-border/40' : 'border-slate-200';

  const cleanNumericValue = (val: string) => {
    return val.replace(/\D/g, '');
  };

  const handleChangeMonto = (val: string) => {
    const cleaned = cleanNumericValue(val);
    setMonto(cleaned || '0');
  };

  useEffect(() => {
    if (visible) {
      if (initialBloqueId) setBloqueSeleccionado(initialBloqueId);
      
      async function cargarOpciones() {
        const user = await obtenerUsuarioPrincipal();
        if (user) {
          const [dataBloques, dataCategorias] = await Promise.all([
            listarBloquesUsuario(user.id),
            listarCategorias()
          ]);
          
          setBloques(dataBloques);
          if (dataBloques.length > 0 && !bloqueSeleccionado && !initialBloqueId) {
             setBloqueSeleccionado(dataBloques[0].id);
          }
          
          setCategorias(dataCategorias);
          if (dataCategorias.length > 0 && !categoriaSeleccionada) setCategoriaSeleccionada(dataCategorias[0].id);
        }
      }
      cargarOpciones();
    }
  }, [visible, initialBloqueId]);

  const handleGuardar = async () => {
    const numericMonto = parseFloat(monto);
    if (!numericMonto || numericMonto <= 0 || !bloqueSeleccionado || descripcion.trim() === '') return;
    
    setEnviando(true);
    try {
      const user = await obtenerUsuarioPrincipal();
      if (user) {
          await registrarGasto(user.id, numericMonto, descripcion, bloqueSeleccionado, categoriaSeleccionada || undefined);
          
          setShowSuccess(true);
          
          setTimeout(() => {
            setShowSuccess(false);
            setMonto('0');
            setDescripcion('');
            onSave();
            onClose();
          }, 1200);
      }
    } catch (e) {
      console.error(e);
      setEnviando(false);
    }
  };

  return (
    <Modal 
        isVisible={visible} 
        onBackdropPress={onClose}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        avoidKeyboard={true}
        propagateSwipe={true}
    >
        <View className="flex-1 justify-end bg-black/40">
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className={`${isDarkMode ? 'bg-dark-bg' : 'bg-white'} rounded-t-[50px] p-8 pb-12 border-t ${isDarkMode ? 'border-brand/20' : 'border-slate-100'} min-h-[85%] max-h-[92%]`}
          >
            {/* Header del Modal */}
            <View className="flex-row items-center justify-between mb-8">
               <View>
                 <Text className={`${textMain} text-3xl font-black tracking-tighter`}>Registrar Gasto</Text>
                 <Text className="text-red-500/60 text-xs font-bold uppercase tracking-widest mt-1">Controla tus egresos</Text>
               </View>
               <TouchableOpacity onPress={onClose} className={`${cardBg} p-3 rounded-2xl border ${borderCol}`}>
                  <X size={20} color={isDarkMode ? "#94A3B8" : "#475569"} />
               </TouchableOpacity>
            </View>

            <ScrollView 
                className="flex-1" 
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View>
                        {/* Input MONTO FORMATEADO */}
                        <View className="mb-10 items-center">
                            <Text className={`${textSubBold} font-bold uppercase tracking-widest text-[10px] mb-4`}>¿Cuánto has gastado?</Text>
                            <View className={`${cardBg}/40 px-10 py-8 rounded-[40px] border ${isDarkMode ? 'border-red-500/10' : 'border-red-500/10'} items-center w-full shadow-lg`}>
                                <View className="flex-row items-center">
                                    <View className="w-8 h-8 rounded-full bg-red-500/20 items-center justify-center mr-3">
                                        <DollarSign size={18} color="#EF4444" strokeWidth={3} />
                                    </View>
                                    <TextInput
                                        placeholder="0"
                                        placeholderTextColor={isDarkMode ? "#484F58" : "#94A3B8"}
                                        keyboardType="numeric"
                                        autoFocus
                                        className={`${textMain} text-5xl font-black tracking-tighter text-center`}
                                        value={formatearCOP(parseFloat(monto) || 0)}
                                        onChangeText={handleChangeMonto}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Input DESCRIPCIÓN */}
                        <View className="mb-8">
                            <View className="flex-row items-center mb-4 ml-1">
                                <AlignLeft size={16} color="#EF4444" />
                                <Text className={`${textSubBold} font-bold uppercase tracking-widest text-[10px] ml-2`}>¿En qué se te fue la plata?</Text>
                            </View>
                            <TextInput
                                placeholder="Ej. Cena, Gasolina, Netflix..."
                                placeholderTextColor={isDarkMode ? "#484F58" : "#94A3B8"}
                                className={`${cardBg} ${textMain} p-6 rounded-3xl border ${borderCol} text-lg font-bold shadow-sm`}
                                value={descripcion}
                                onChangeText={setDescripcion}
                            />
                        </View>

                        {/* Selector de BOLSILLO */}
                        <View className="mb-8">
                            <View className="flex-row items-center mb-5 ml-1">
                                <Layers size={16} color="#22C55E" />
                                <Text className="text-brand font-bold uppercase tracking-widest text-[10px] ml-2">¿De cuál bolsillo sale?</Text>
                            </View>
                                                        <View className="flex-row flex-wrap">
                                {bloques.length === 0 ? (
                                    <View className={`${cardBg} p-5 rounded-3xl border border-dashed ${borderCol} w-full items-center`}>
                                        <Text className={`${textSub} text-[11px] text-center italic`}>No tienes bolsillos creados.</Text>
                                    </View>
                                ) : bloques.map((bloque) => (
                                    <TouchableOpacity 
                                        key={bloque.id} 
                                        onPress={() => setBloqueSeleccionado(bloque.id)}
                                        className={`px-6 py-4 rounded-2xl mr-3 mb-3 border ${bloqueSeleccionado === bloque.id ? 'bg-brand border-brand' : `${cardBg} ${borderCol}`}`}
                                    >
                                        <Text className={`font-black text-[13px] ${bloqueSeleccionado === bloque.id ? 'text-black' : isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            {bloque.nombre}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Selector de CATEGORIA */}
                        <View className="mb-10">
                            <View className="flex-row items-center mb-5 ml-1">
                                <Tag size={16} color="#3B82F6" />
                                <Text className="text-blue-400 font-bold uppercase tracking-widest text-[10px] ml-2">Etiquetar gasto como...</Text>
                            </View>
                                                        <View className="flex-row flex-wrap">
                                {categorias.length === 0 ? (
                                    <View className={`${cardBg} p-5 rounded-3xl border border-dashed ${borderCol} w-full items-center`}>
                                        <Text className={`${textSub} text-[11px] text-center italic`}>No tienes categorías creadas.</Text>
                                    </View>
                                ) : categorias.map((cat) => (
                                    <TouchableOpacity 
                                        key={cat.id} 
                                        onPress={() => setCategoriaSeleccionada(cat.id)}
                                        className={`px-6 py-4 rounded-2xl mr-3 mb-3 border ${categoriaSeleccionada === cat.id ? 'bg-blue-500 border-blue-500' : `${cardBg} ${borderCol}`}`}
                                        style={categoriaSeleccionada === cat.id ? { backgroundColor: cat.color || '#3B82F6' } : {}}
                                    >
                                        <Text className={`font-black text-[13px] ${categoriaSeleccionada === cat.id ? 'text-white' : isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            {cat.nombre}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>

            {/* Acción Principal Fija Abajo */}
            <View className="pt-6">
                <Button 
                    titulo={enviando ? "Registrando salida..." : "Confirmar Salida de Dinero"} 
                    onPress={handleGuardar}
                    disabled={parseFloat(monto) <= 0 || !bloqueSeleccionado || descripcion.trim() === '' || enviando}
                    className="h-16 rounded-[25px]"
                />
            </View>
          </KeyboardAvoidingView>
        </View>

      {/* Alerta de Éxito Overlay */}
      <Modal 
        isVisible={showSuccess}
        animationIn="zoomIn"
        animationOut="fadeOut"
        backdropOpacity={0.8}
        className="m-0 items-center justify-center"
      >
        <View className="bg-brand w-36 h-36 rounded-[45px] items-center justify-center shadow-2xl">
            <Check size={70} color="#000" strokeWidth={5} />
        </View>
        <Text className="text-white text-3xl font-black mt-8 tracking-tighter">¡Gasto Registrado!</Text>
        <Text className="text-brand text-xs font-bold uppercase tracking-[4px] mt-2 opacity-80">Daniq Premium</Text>
      </Modal>
    </Modal>
  );
}
