import { useLocalSearchParams, Stack } from 'expo-router';
import DetalleBloquePage from '../../features/bloques/pages/DetalleBloquePage';

/**
 * Route: /bloque/[id]
 * Detalle dinámico de un bolsillo de gasto.
 */
export default function BloqueDetalleRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <DetalleBloquePage id={id} />
    </>
  );
}
