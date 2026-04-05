import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { X, Check, Image as ImageIcon, Camera } from 'lucide-react-native';
import Button from '../../../shared/components/Button';
import ColorPicker from 'react-native-wheel-color-picker';
import Modal from 'react-native-modal';
import ModalExito from '../../../shared/components/ModalExito';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useTheme } from '../../../core/contexts/ThemeContext';

interface ModalCrearBloqueProps {
  visible: boolean;
  onClose: () => void;
  onSave: (nombre: string, color: string, imagen?: string) => Promise<void>;
  bloqueAEditar?: { id: number; nombre: string; color: string; imagen?: string } | null;
}

/**
 * ModalCrearBloque: Ahora con Scroll Fluido, Wheel Picker y Alerta de Éxito.
 */
export default function ModalCrearBloque({ visible, onClose, onSave, bloqueAEditar }: ModalCrearBloqueProps) {
  const { isDarkMode } = useTheme();
  const [nombre, setNombre] = useState('');
  const [colorSel, setColorSel] = useState('#22C55E');
  const [imagen, setImagen] = useState<string | undefined>(undefined);
  const [enviando, setEnviando] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Inicializar si estamos editando
  React.useEffect(() => {
    if (visible && bloqueAEditar) {
        setNombre(bloqueAEditar.nombre);
        setColorSel(bloqueAEditar.color);
        setImagen(bloqueAEditar.imagen);
    } else if (visible && !bloqueAEditar) {
        setNombre('');
        setColorSel('#22C55E');
        setImagen(undefined);
    }
  }, [visible, bloqueAEditar]);

  // Colores Dinámicos
  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSub = isDarkMode ? 'text-slate-500' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-dark-card' : 'bg-slate-100';
  const borderCol = isDarkMode ? 'border-brand/20' : 'border-slate-100';

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });

    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  const handleGuardar = async () => {
    if (nombre.trim().length < 3) return;
    setEnviando(true);
    
    try {
      await onSave(nombre, colorSel, imagen);
      
      // Mostrar animación de éxito
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        setNombre('');
        setColorSel('#22C55E');
        setImagen(undefined);
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
                        <View className="mb-10 h-[350px]">
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

                        {/* Selector de Imagen */}
                        <View className="mb-10">
                            <Text className={`${textSub} font-bold uppercase tracking-widest text-[10px] mb-4 ml-1`}>Imagen Personalizada (Opcional)</Text>
                            <TouchableOpacity 
                                onPress={pickImage}
                                className={`${cardBg} h-40 rounded-[40px] border border-dashed ${borderCol} items-center justify-center overflow-hidden`}
                            >
                                {imagen ? (
                                    <View className="w-full h-full">
                                        <Image source={{ uri: imagen }} contentFit="cover" style={{ width: '100%', height: '100%' }} />
                                        <View className="absolute inset-0 bg-black/20 items-center justify-center">
                                            <Camera size={24} color="#FFF" />
                                            <Text className="text-white text-[10px] font-bold uppercase mt-2">Cambiar Foto</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View className="items-center">
                                        <View className="w-14 h-14 rounded-full bg-brand/10 items-center justify-center mb-4">
                                            <ImageIcon size={24} color="#22C55E" />
                                        </View>
                                        <Text className={`${textSub} text-[11px] font-bold uppercase tracking-widest`}>Subir una imagen</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>

            {/* Acción Principal */}
            <View className="pt-6">
                <Button 
                    titulo={enviando ? "Guardando cambios..." : (bloqueAEditar ? "Guardar Cambios" : "Crear Bolsillo")} 
                    onPress={handleGuardar}
                    disabled={nombre.trim().length < 3 || enviando}
                    className="h-16 rounded-[25px]"
                />
            </View>
          </KeyboardAvoidingView>
        </View>

      {/* Alerta de Éxito Overlay Reemplazada */}
      <ModalExito 
        visible={showSuccess}
        titulo={bloqueAEditar ? '¡Bolsillo Actualizado!' : '¡Bolsillo Creado!'}
      />
    </Modal>
  );
}
