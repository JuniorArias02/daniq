import { useState, useEffect } from 'react';
import { obtenerUsuarioPrincipal } from '../../usuario/services/usuarioService';
import { seguridadService } from '../services/seguridadService';

export function useSeguridad() {
  const [tipoActual, setTipoActual] = useState<'ninguno' | 'pin' | 'contrasena'>('ninguno');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarSettings();
  }, []);

  const cargarSettings = async () => {
    try {
      const user = await obtenerUsuarioPrincipal();
      if (!user) return;
      const data = await seguridadService.obtenerEstadoSeguridad(user.id);
      if (data && data.tipo_seguridad) {
        setTipoActual(data.tipo_seguridad as any);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const configurarSinSeguridad = async () => {
    try {
      setCargando(true);
      const user = await obtenerUsuarioPrincipal();
      if (!user) return;
      await seguridadService.guardarTipoSeguridad(user.id, 'ninguno');
      await cargarSettings();
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  const configurarPin = async (nuevoPin: string) => {
    try {
      setCargando(true);
      const user = await obtenerUsuarioPrincipal();
      if (!user) return;
      await seguridadService.guardarTipoSeguridad(user.id, 'pin', nuevoPin, null);
      await cargarSettings();
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  const configurarPassword = async (nuevoPass: string) => {
    try {
      setCargando(true);
      const user = await obtenerUsuarioPrincipal();
      if (!user) return;
      await seguridadService.guardarTipoSeguridad(user.id, 'contrasena', null, nuevoPass);
      await cargarSettings();
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  return { tipoActual, cargando, refrescar: cargarSettings, configurarPin, configurarPassword, configurarSinSeguridad };
}
