import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, Alert } from 'react-native';
import { X, Check, ShoppingBag, DollarSign } from 'lucide-react-native';
import Button from '../../../shared/components/Button';
import Modal from 'react-native-modal';
import ModalExito from '../../../shared/components/ModalExito';
import { useTheme } from '../../../core/contexts/ThemeContext';
import { formatearCOP } from '../../../core/utils/formatearDinero';
import { itemBloqueService } from '../services/itemBloqueService';

interface ModalCrearItemBloqueProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  bloqueId: number;
}

/**
 * ModalCrearItemBloque: Permite planificar un gasto ("Meta de item") dentro de un bolsillo.
 */
export default function ModalCrearItemBloque({ visible, onClose, onSave, bloqueId }: ModalCrearItemBloqueProps) {
  const { isDarkMode } = useTheme();
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Colores Dinámicos Premium
  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSub = isDarkMode ? 'text-slate-500' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-dark-card' : 'bg-slate-100';
  const borderCol = isDarkMode ? 'border-brand/20' : 'border-slate-100';

  const cleanNumericValue = (val: string) => {
    return val.replace(/\D/g, '');
  };

  const handleChangeMonto = (val: string) => {
    const cleaned = cleanNumericValue(val);
    setMonto(cleaned);
  };

  const handleGuardar = async () => {
    if (nombre.trim().length < 3) {
      Alert.alert("Campo Requerido", "Dale un nombre más claro a lo que vas a comprar.");
      return;
    }
    
    const numericMonto = parseFloat(monto);
    if (!numericMonto || numericMonto <= 0) {
      Alert.alert("Monto Inválido", "Ingresa un precio estimado para este item.");
      return;
    }

    setEnviando(true);
    
    try {
      await itemBloqueService.agregarItem(bloqueId, nombre, numericMonto);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        setNombre('');
        setMonto('');
        setEnviando(false);
        onSave();
        onClose();
      }, 1200);
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
            className={`${isDarkMode ? 'bg-dark-bg' : 'bg-white'} rounded-t-[50px] p-8 pb-12 border-t ${borderCol} min-h-[70%] max-h-[85%]`}
          >
            {/* Header del Modal */}
            <View className="flex-row items-center justify-between mb-8">
               <View>
                 <Text className={`${textMain} text-3xl font-black tracking-tighter`}>Nueva Meta</Text>
                 <Text className={`${textSub} text-xs font-bold uppercase tracking-widest mt-1`}>¿En que planeas gastar?</Text>
               </View>
               <TouchableOpacity onPress={onClose} className={`${cardBg} p-3 rounded-2xl border ${borderCol}`}>
                  <X size={20} color={isDarkMode ? "#94A3B8" : "#475569"} />
               </TouchableOpacity>
            </View>

            <ScrollView 
                className="flex-1" 
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View>
                        {/* Input Nombre del Item */}
                        <View className="mb-8">
                            <View className="flex-row items-center mb-4 ml-1">
                                <ShoppingBag size={16} color="#22C55E" />
                                <Text className="text-brand font-bold uppercase tracking-widest text-[10px] ml-2">¿Qué necesitas comprar?</Text>
                            </View>
                            <TextInput
                                placeholder="Ej. Zapatillas, Pintura, Maleta..."
                                placeholderTextColor={isDarkMode ? "#484F58" : "#94A3B8"}
                                className={`${cardBg} ${textMain} p-6 rounded-3xl border ${borderCol} text-xl font-bold shadow-sm`}
                                value={nombre}
                                onChangeText={setNombre}
                            />
                        </View>

                        {/* Input Monto Planificado */}
                        <View className="mb-10 items-center">
                            <Text className={`${textSub} font-bold uppercase tracking-widest text-[10px] mb-4`}>¿Cuánto estimas que cuesta?</Text>
                            <View className={`${cardBg}/40 px-10 py-8 rounded-[40px] border border-brand/20 items-center w-full shadow-lg`}>
                                <View className="flex-row items-center">
                                    <View className="w-8 h-8 rounded-full bg-brand/20 items-center justify-center mr-3">
                                        <DollarSign size={18} color="#22C55E" strokeWidth={3} />
                                    </View>
                                    <TextInput
                                        placeholder="0"
                                        placeholderTextColor={isDarkMode ? "#484F58" : "#94A3B8"}
                                        keyboardType="numeric"
                                        className={`${textMain} text-5xl font-black tracking-tighter text-center`}
                                        value={monto === '' ? '' : formatearCOP(parseFloat(monto) || 0)}
                                        onChangeText={handleChangeMonto}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>

            {/* Acción Principal */}
            <View className="pt-6">
                <Button 
                    titulo={enviando ? "Guardando meta..." : "Agregar a mi Plan"} 
                    onPress={handleGuardar}
                    disabled={enviando}
                    className="h-16 rounded-[25px]"
                />
            </View>
          </KeyboardAvoidingView>
        </View>

      {/* Alerta de Éxito Overlay Reemplazada */}
      <ModalExito 
        visible={showSuccess}
        titulo="¡Meta Guardada!"
      />
    </Modal>
  );
}
