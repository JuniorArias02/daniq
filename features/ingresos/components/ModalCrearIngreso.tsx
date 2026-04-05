import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { X, Check, TrendingUp, AlignLeft, DollarSign } from 'lucide-react-native';
import Button from '../../../shared/components/Button';
import { registrarIngreso } from '../services/ingresoService';
import { obtenerUsuarioPrincipal } from '../../usuario/services/usuarioService';
import { formatearCOP } from '../../../core/utils/formatearDinero';
import Modal from 'react-native-modal';
import { useTheme } from '../../../core/contexts/ThemeContext';

interface ModalCrearIngresoProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
}

/**
 * ModalCrearIngreso: Ahora con el diseño Premium "Daniq", Scroll fluido y Alerta de Éxito.
 */
export default function ModalCrearIngreso({ visible, onClose, onSave }: ModalCrearIngresoProps) {
  const { isDarkMode } = useTheme();
  const [monto, setMonto] = useState('0');
  const [descripcion, setDescripcion] = useState('');
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

  const handleGuardar = async () => {
    const numericMonto = parseFloat(monto);
    if (!numericMonto || numericMonto <= 0 || descripcion.trim() === '') return;
    
    setEnviando(true);
    try {
      const user = await obtenerUsuarioPrincipal();
      if (user) {
          await registrarIngreso(user.id, numericMonto, descripcion);
          
          // Mostrar animación de éxito
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
            className={`${isDarkMode ? 'bg-dark-bg' : 'bg-white'} rounded-t-[50px] p-8 pb-12 border-t ${isDarkMode ? 'border-brand/20' : 'border-slate-100'} min-h-[70%] max-h-[85%]`}
          >
            {/* Header del Modal */}
            <View className="flex-row items-center justify-between mb-8">
               <View>
                 <Text className={`${textMain} text-3xl font-black tracking-tighter`}>Nuevo Ingreso</Text>
                 <Text className="text-brand text-xs font-bold uppercase tracking-widest mt-1">Suma a tu fortuna</Text>
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
                        <View className="mb-12 items-center">
                            <Text className={`${textSubBold} font-bold uppercase tracking-widest text-[10px] mb-4`}>¿Cuánto has recibido?</Text>
                            <View className={`${cardBg}/40 px-10 py-8 rounded-[40px] border ${isDarkMode ? 'border-brand/10' : 'border-brand/30'} items-center w-full shadow-lg`}>
                                <View className="flex-row items-center">
                                    <DollarSign size={24} color="#22C55E" strokeWidth={3} className="mr-2" />
                                    <TextInput
                                        placeholder="0"
                                        placeholderTextColor={isDarkMode ? "#1E293B" : "#94A3B8"}
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
                        <View className="mb-10">
                            <View className="flex-row items-center mb-5 ml-1">
                                <AlignLeft size={16} color="#22C55E" />
                                <Text className={`${textSubBold} font-bold uppercase tracking-widest text-[10px] ml-2`}>¿De qué es esta entrada?</Text>
                            </View>
                            <TextInput
                                placeholder="Ej. Pago de Salario, Venta, Freelance..."
                                placeholderTextColor={isDarkMode ? "#484F58" : "#94A3B8"}
                                className={`${cardBg} ${textMain} p-6 rounded-3xl border ${borderCol} text-lg font-bold shadow-sm`}
                                value={descripcion}
                                onChangeText={setDescripcion}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>

            {/* Botón de Acción Principal */}
            <View className="pt-6">
                <Button 
                    titulo={enviando ? "Procesando ingreso..." : "Confirmar Ingreso en Cuenta"} 
                    onPress={handleGuardar}
                    disabled={parseFloat(monto) <= 0 || descripcion.trim() === '' || enviando}
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
        <Text className="text-white text-3xl font-black mt-8 tracking-tighter">¡Ingreso Exitoso!</Text>
        <Text className="text-brand text-xs font-bold uppercase tracking-[4px] mt-2 opacity-80">Daniq Premium</Text>
      </Modal>
    </Modal>
  );
}
