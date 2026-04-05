import { Link, Stack } from 'expo-router';
import CategoriasPage from '../features/categorias/pages/CategoriasPage';

/**
 * Route: /categorias
 * Bridge para la vista de categorías globales.
 */
export default function CategoriasRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <CategoriasPage />
    </>
  );
}
