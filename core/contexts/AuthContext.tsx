import React, { createContext, useContext, useState, useEffect } from 'react';
import { obtenerUsuarioPrincipal } from '../../features/usuario/services/usuarioService';
import { useDatabase } from '../hooks/useDatabase';

interface AuthContextType {
  usuario: any;
  loadingUser: boolean;
  actualizarUsuario: () => Promise<void>;
  reiniciarUsuario: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isDbReady } = useDatabase();
  const [usuario, setUsuario] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const actualizarUsuario = async () => {
    try {
      const user = await obtenerUsuarioPrincipal();
      setUsuario(user);
    } catch (e) {
      console.error("Error en AuthContext:", e);
    } finally {
      setLoadingUser(false);
    }
  };

  const reiniciarUsuario = () => {
    setUsuario(null);
    setLoadingUser(false);
  };

  useEffect(() => {
    if (isDbReady) {
      actualizarUsuario();
    }
  }, [isDbReady]);

  return (
    <AuthContext.Provider value={{ usuario, loadingUser, actualizarUsuario, reiniciarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
