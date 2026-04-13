import { useEffect, useState } from "react";
import { Slot, Stack } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, ActivityIndicator, Image } from "react-native";
import { useDatabase } from "../core/hooks/useDatabase";
import RegistroUsuarioPage from "../features/usuario/pages/RegistroUsuarioPage";
import "../global.css";

import CustomDrawer from "../core/layouts/CustomDrawer";
import { ThemeProvider, useTheme } from "../core/contexts/ThemeContext";
import { AuthProvider, useAuth } from "../core/contexts/AuthContext";
import AuthGuard from "../features/autenticacion/components/AuthGuard";

/**
 * RootLayout: Corazón de Daniq.
 * Sincroniza Tema, Base de Datos e Identidad.
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <AuthProvider>
            <LayoutContent />
          </AuthProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

import { useNotificaciones } from "../features/notificaciones/hooks/useNotificaciones";

function LayoutContent() {
  const { isDbReady, error } = useDatabase();
  const { isDarkMode } = useTheme();
  const { usuario, loadingUser, actualizarUsuario, reiniciarUsuario } = useAuth();

  // Inicializar notificaciones (Cada 3 horas)
  useNotificaciones(3);

  // Si hay error en DB
  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-dark-bg px-10">
        <Text className="text-red-500 text-2xl font-bold mb-4">Error Crítico</Text>
        <Text className="text-white text-center opacity-70">Error en la base de datos local. Por favor reinicia la app.</Text>
      </View>
    );
  }

  // Splash Screen de arranque
  if (!isDbReady || loadingUser) {
    return (
      <View className={`flex-1 items-center justify-center ${isDarkMode ? 'bg-dark-bg' : 'bg-white'}`}>
        <ActivityIndicator size="small" color="#22C55E" />
      </View>
    );
  }

  // Si NO hay usuario registrado, mostramos el Onboarding
  if (!usuario) {
    return <RegistroUsuarioPage onFinish={actualizarUsuario} />;
  }

  // Flujo principal con Drawer Navegador Estable
  return (
    <AuthGuard>
      <Drawer
        drawerContent={(props: any) => <CustomDrawer {...props} onReset={reiniciarUsuario} />}
        screenOptions={{
          headerShown: false,
          drawerType: 'front',
          drawerStyle: {
            backgroundColor: isDarkMode ? '#0D1117' : '#FFFFFF',
            width: '80%',
          },
          overlayColor: 'rgba(0,0,0,0.7)',
        }}
      >
        <Drawer.Screen 
          name="(tabs)" 
          options={{ drawerLabel: "Resumen Principal", title: "Daniq" }} 
        />
        {/* Añadimos explícitamente configuracion para evitar el crash de contexto en rutas huérfanas */}
        <Drawer.Screen 
          name="configuracion" 
          options={{ drawerItemStyle: { display: 'none' } }} 
        />
      </Drawer>
    </AuthGuard>
  );
}
