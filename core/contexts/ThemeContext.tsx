import React, { createContext, useContext, useState, useEffect } from 'react';
import { obtenerUsuarioPrincipal } from '../../features/usuario/services/usuarioService';
import { obtenerPreferencias, cambiarModoOscuro } from '../../features/configuracion/services/configuracionService';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => Promise<void>;
  isLoadingTheme: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoadingTheme, setIsLoadingTheme] = useState(true);

  const cargarPreferencias = async () => {
    try {
      const user = await obtenerUsuarioPrincipal();
      if (user) {
        const prefs = await obtenerPreferencias(user.id);
        setIsDarkMode(prefs.modoOscuro);
      }
    } catch (e) {
      console.error("Error cargando tema:", e);
    } finally {
      setIsLoadingTheme(false);
    }
  };

  useEffect(() => {
    cargarPreferencias();
  }, []);

  const toggleTheme = async () => {
    const nuevoEstado = !isDarkMode;
    setIsDarkMode(nuevoEstado);
    try {
      const user = await obtenerUsuarioPrincipal();
      if (user) {
        await cambiarModoOscuro(user.id, nuevoEstado);
      }
    } catch (e) {
      console.error("Error persistiendo tema:", e);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, isLoadingTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
}
