import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { X, Check } from 'lucide-react-native';
import Button from '../../../shared/components/Button';
import ColorPicker from 'react-native-wheel-color-picker';
import Modal from 'react-native-modal';
import { useTheme } from '../../../core/contexts/ThemeContext';

interface ModalCrearBloqueProps {
  visible: boolean;
  onClose: () => void;
  onSave: (nombre: string, color: string) => Promise<void>;
}

/**
 * ModalCrearBloque: Ahora con Scroll Fluido, Wheel Picker y Alerta de Éxito.
 */
export default function ModalCrearBloque({ visible, onClose, onSave }: ModalCrearBloqueProps) {
  const { isDarkMode } = useTheme();
  const [nombre, setNombre] = useState('');
  const [colorSel, setColorSel] = useState('#22C55E');
  const [enviando, setEnviando] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Colores Dinámicos
  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSub = isDarkMode ? 'text-slate-500' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-dark-card' : 'bg-slate-100';
  const borderCol = isDarkMode ? 'border-brand/20' : 'border-slate-100';

  const handleGuardar = async () => {
    if (nombre.trim().length < 3) return;
    setEnviando(true);
    
    try {
      await onSave(nombre, colorSel);
      
      // Mostrar animación de éxito
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        setNombre('');
        setEnviando(false);
        onClose();
      }, 1200);
    } catch (e) {
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
            className={`${isDarkMode ? 'bg-dark-bg' : 'bg-white'} rounded-t-[50px] p-8 pb-12 border-t ${borderCol} min-h-[85%] max-h-[95%]`}
          >
            {/* Header del Modal */}
            <View className="flex-row items-center justify-between mb-8">
               <View>
                 <Text className={`${textMain} text-3xl font-black tracking-tighter`}>Nuevo Bolsillo</Text>
                 <Text className={`${textSub} text-xs font-bold uppercase tracking-widest mt-1`}>Organiza tus metas</Text>
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
                        {/* Input Nombre */}
                        <View className="mb-10">
                            <Text className="text-brand font-bold uppercase tracking-widest text-[10px] mb-4 ml-1">¿Cómo se llamará este bolsillo?</Text>
                            <TextInput
                                placeholder="Ej. Viaje a la playa, Fondo Emergencia..."
                                placeholderTextColor={isDarkMode ? "#484F58" : "#94A3B8"}
                                className={`${cardBg} ${textMain} p-6 rounded-3xl border ${borderCol} text-xl font-bold shadow-sm`}
                                value={nombre}
                                onChangeText={setNombre}
                            />
                        </View>

                        {/* WHEEL Color Picker Premium */}
                        <View className="mb-12 h-[350px]">
                            <View className="flex-row items-center justify-between mb-8 ml-1">
                                <Text className={`${textSub} font-bold uppercase tracking-widest text-[10px]`}>Elegir Color Identificador</Text>
                                <View className="w-12 h-6 rounded-full border border-white/10" style={{ backgroundColor: colorSel }} />
                            </View>

                            <ColorPicker
                                color={colorSel}
                                onColorChange={setColorSel}
                                thumbSize={40}
                                sliderSize={40}
                                noSnap={true}
                                row={false}
                                swatches={true}
                                swatchesLast={false}
                                discrete={false}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>

            {/* Acción Principal */}
            <View className="pt-6">
                <Button 
                    titulo={enviando ? "Asegurando bolsillo..." : "Crear Bolsillo"} 
                    onPress={handleGuardar}
                    disabled={nombre.trim().length < 3 || enviando}
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
        className="m-0 items-center justify-center shadow-2xl shadow-brand/40"
      >
        <View className="bg-brand w-36 h-36 rounded-[45px] items-center justify-center shadow-2xl">
            <Check size={70} color="#000" strokeWidth={5} />
        </View>
        <Text className="text-white text-3xl font-black mt-8 tracking-tighter">¡Bolsillo Creado!</Text>
        <Text className="text-brand text-xs font-bold uppercase tracking-[4px] mt-2 opacity-80">Daniq Premium</Text>
      </Modal>
    </Modal>
  );
}
