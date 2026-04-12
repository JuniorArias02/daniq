import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, Alert } from 'react-native';
import { X, Check, TrendingUp, AlignLeft, DollarSign } from 'lucide-react-native';
import Button from '../../../shared/components/Button';
import { registrarIngreso, actualizarIngreso } from '../services/ingresoService';
import { obtenerUsuarioPrincipal } from '../../usuario/services/usuarioService';
import { formatearCOP } from '../../../core/utils/formatearDinero';
import Modal from 'react-native-modal';
import ModalExito from '../../../shared/components/ModalExito';
import { useTheme } from '../../../core/contexts/ThemeContext';

interface ModalCrearIngresoProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  ingresoAEditar?: any | null; // Si viene, el modal funciona en modo edición
}

/**
 * ModalCrearIngreso: Crea o edita un ingreso.
 * Modo edición activado cuando se pasa `ingresoAEditar`.
 */
export default function ModalCrearIngreso({ visible, onClose, onSave, ingresoAEditar }: ModalCrearIngresoProps) {
  const { isDarkMode } = useTheme();
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const esEdicion = !!ingresoAEditar;

  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSub = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const textSubBold = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const cardBg = isDarkMode ? 'bg-dark-card' : 'bg-slate-100';
  const borderCol = isDarkMode ? 'border-dark-border/40' : 'border-slate-200';

  // Cuando el modal se abre en modo edición, pre-carga los valores
  useEffect(() => {
    if (ingresoAEditar && visible) {
      setMonto(String(Math.round(ingresoAEditar.monto)));
      setDescripcion(ingresoAEditar.descripcion || '');
    } else if (!visible) {
      setMonto('');
      setDescripcion('');
    }
  }, [ingresoAEditar, visible]);

  const cleanNumericValue = (val: string) => {
    return val.replace(/\D/g, '');
  };

  const handleChangeMonto = (val: string) => {
    const cleaned = cleanNumericValue(val);
    setMonto(cleaned);
  };

  const handleGuardar = async () => {
    if (monto.trim() === '') {
      Alert.alert("Campo Requerido", "El campo de monto no puede estar vacío.");
      return;
    }

    const numericMonto = parseFloat(monto);
    if (!numericMonto || numericMonto <= 0) {
      Alert.alert("Monto Inválido", "El monto no puede ser cero.");
      return;
    }

    if (descripcion.trim() === '') {
      Alert.alert("Descripción Faltante", "Por favor ingresa una descripción para este ingreso.");
      return;
    }
    
    setEnviando(true);
    try {
      if (esEdicion) {
        // Modo edición: actualizar el ingreso existente
        await actualizarIngreso(ingresoAEditar.id, numericMonto, descripcion);
      } else {
        // Modo creación: registrar nuevo ingreso
        const user = await obtenerUsuarioPrincipal();
        if (user) {
          await registrarIngreso(user.id, numericMonto, descripcion);
        }
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setMonto('');
        setDescripcion('');
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
            className={`${isDarkMode ? 'bg-dark-bg' : 'bg-white'} rounded-t-[50px] p-8 pb-12 border-t ${isDarkMode ? 'border-brand/20' : 'border-slate-100'} min-h-[70%] max-h-[85%]`}
          >
            {/* Header del Modal */}
            <View className="flex-row items-center justify-between mb-8">
               <View>
                 <Text className={`${textMain} text-3xl font-black tracking-tighter`}>
                   {esEdicion ? 'Editar Ingreso' : 'Nuevo Ingreso'}
                 </Text>
                 <Text className="text-brand text-xs font-bold uppercase tracking-widest mt-1">
                   {esEdicion ? 'Corrige el monto o descripción' : 'Suma a tu fortuna'}
                 </Text>
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
                                        autoFocus={!esEdicion}
                                        className={`${textMain} text-5xl font-black tracking-tighter text-center`}
                                        value={monto === '' ? '' : formatearCOP(parseFloat(monto) || 0)}
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
                    titulo={enviando ? "Guardando..." : esEdicion ? "Guardar Cambios" : "Confirmar Ingreso en Cuenta"} 
                    onPress={handleGuardar}
                    disabled={enviando}
                    className="h-16 rounded-[25px]"
                />
            </View>
          </KeyboardAvoidingView>
        </View>

      {/* Alerta de Éxito */}
      <ModalExito 
        visible={showSuccess}
        titulo={esEdicion ? "¡Ingreso Actualizado!" : "¡Ingreso Exitoso!"}
      />
    </Modal>
  );
}
