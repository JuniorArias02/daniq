import { Stack } from 'expo-router';
import ReportesPage from '../../features/reportes/pages/ReportesPage';

/**
 * Pestaña de Reportes: Vista estándar (Tab).
 */
export default function ReportesRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ReportesPage />
    </>
  );
}
