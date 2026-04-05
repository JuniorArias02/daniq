import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { 
  X, Check, ShoppingCart, Utensils, Zap, Bus, Coffee, Heart, Briefcase, Car, Home, 
  IceCream, Shirt, GraduationCap, Dog, Gift, Dumbbell, Sparkles, TrendingUp, MoreHorizontal 
} from 'lucide-react-native';
import Button from '../../../shared/components/Button';
import ColorPicker from 'react-native-wheel-color-picker';
import Modal from 'react-native-modal';
import { useTheme } from '../../../core/contexts/ThemeContext';

interface ModalCrearCategoriaProps {
  visible: boolean;
  onClose: () => void;
  onSave: (nombre: string, icono: string, color: string) => Promise<void>;
}

const ICONOS = [
  { name: 'Utensils', icon: Utensils },
  { name: 'IceCream', icon: IceCream },
  { name: 'Car', icon: Car },
  { name: 'Home', icon: Home },
  { name: 'Heart', icon: Heart },
  { name: 'Gamepad2', icon: Zap },
  { name: 'PlayCircle', icon: Coffee },
  { name: 'Shirt', icon: Shirt },
  { name: 'GraduationCap', icon: GraduationCap },
  { name: 'Dog', icon: Dog },
  { name: 'Gift', icon: Gift },
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'MoreHorizontal', icon: MoreHorizontal },
];

/**
 * ModalCrearCategoria: Optimizado para scroll fluido y experiencia premium.
 */
export default function ModalCrearCategoria({ visible, onClose, onSave }: ModalCrearCategoriaProps) {
  const { isDarkMode } = useTheme();
  const [nombre, setNombre] = useState('');
  const [colorSel, setColorSel] = useState('#22C55E');
  const [iconSel, setIconSel] = useState('Utensils');
  const [enviando, setEnviando] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSub = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const textSubBold = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const cardBg = isDarkMode ? 'bg-dark-card' : 'bg-slate-100';
  const borderCol = isDarkMode ? 'border-dark-border/40' : 'border-slate-200';

  const handleGuardar = async () => {
    if (nombre.trim() === '') return;
    setEnviando(true);
    
    try {
      await onSave(nombre, iconSel, colorSel);
      
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
            className={`${isDarkMode ? 'bg-dark-bg' : 'bg-white'} rounded-t-[50px] p-8 pb-12 border-t ${isDarkMode ? 'border-brand/20' : 'border-slate-100'} min-h-[90%] max-h-[95%]`}
          >
            {/* Header Fijo */}
            <View className="flex-row items-center justify-between mb-8">
               <View>
                 <Text className={`${textMain} text-3xl font-black tracking-tighter`}>Nueva Categoría</Text>
                 <Text className={`${textSubBold} text-xs font-bold uppercase tracking-widest mt-1`}>Dale vida a tus finanzas</Text>
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
                {/* Contenido envuelto para poder cerrar teclado al tocar zonas vacías pero SIN bloquear scroll */}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View>
                        {/* Input Nombre */}
                        <View className="mb-10">
                            <Text className={`${textSubBold} font-bold uppercase tracking-widest text-[10px] mb-4 ml-1`}>¿Cómo la llamarás?</Text>
                            <TextInput
                                placeholder="Ej. Antojitos de la calle..."
                                placeholderTextColor={isDarkMode ? "#484F58" : "#94A3B8"}
                                className={`${cardBg} ${textMain} p-6 rounded-3xl border ${isDarkMode ? 'border-brand/20' : 'border-slate-100'} text-xl font-bold shadow-sm`}
                                value={nombre}
                                onChangeText={setNombre}
                            />
                        </View>

                        {/* Grid de Iconos */}
                        <View className="mb-10">
                            <Text className={`${textSubBold} font-bold uppercase tracking-widest text-[10px] mb-5 ml-1`}>Icono Representativo</Text>
                            <View className="flex-row flex-wrap justify-between">
                                {ICONOS.map((item) => (
                                    <TouchableOpacity 
                                        key={item.name}
                                        onPress={() => setIconSel(item.name)}
                                        className={`w-[18%] aspect-square rounded-2xl items-center justify-center mb-4 border ${iconSel === item.name ? 'bg-brand border-brand' : `${cardBg} ${borderCol}`}`}
                                    >
                                        <item.icon size={22} color={iconSel === item.name ? '#000' : isDarkMode ? '#484F58' : '#94A3B8'} strokeWidth={iconSel === item.name ? 2 : 1.5} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* WHEEL Color Picker Premium */}
                        <View className="mb-12 h-[380px]">
                            <View className="flex-row items-center justify-between mb-8 ml-1">
                                <Text className={`${textSubBold} font-bold uppercase tracking-widest text-[10px]`}>Identificador de Color</Text>
                                <View className={`w-12 h-6 rounded-full border ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`} style={{ backgroundColor: colorSel }} />
                            </View>

                            <ColorPicker
                                color={colorSel}
                                onColorChange={setColorSel}
                                thumbSize={40}
                                sliderSize={40}
                                noSnap={true}
                                row={false}
                                swatches={true}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>

            {/* Acción Principal Fija Abajo */}
            <View className="pt-6">
                <Button 
                    titulo={enviando ? "Asegurando datos..." : "Crear Categoría"} 
                    onPress={handleGuardar}
                    disabled={nombre.trim() === '' || enviando}
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
        <Text className="text-white text-3xl font-black mt-8 tracking-tighter">¡Categoría Lista!</Text>
        <Text className="text-brand text-xs font-bold uppercase tracking-[4px] mt-2 opacity-80">Daniq Premium</Text>
      </Modal>
    </Modal>
  );
}
