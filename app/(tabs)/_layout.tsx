import { createMaterialTopTabNavigator, MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { Home, PieChart, Layers, User } from 'lucide-react-native';
import { View, Text } from 'react-native';
import { useTheme } from '../../core/contexts/ThemeContext';

const { Navigator } = createMaterialTopTabNavigator();

// Adaptar el MaterialTopTabNavigator para que funcione con las rutas de Expo Router
export const MaterialTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator
>(Navigator);

export default function TabLayout() {
  const { isDarkMode } = useTheme();

  return (
    <MaterialTabs
      tabBarPosition="bottom"
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: '#22C55E',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarPressColor: 'transparent',
        tabBarIndicatorStyle: {
           backgroundColor: '#22C55E',
           top: 0,
           height: 3,
           width: 40,
           marginLeft: '6%', // Centrado bajo el icono aproximadamente
           borderRadius: 30,
        },
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#0D1117' : '#FFFFFF',
          borderTopColor: isDarkMode ? '#30363D' : '#E2E8F0',
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 15,
          elevation: isDarkMode ? 0 : 8,
          shadowOpacity: isDarkMode ? 0 : 0.1,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          textTransform: 'none',
        },
        // Forzar renderizado de iconos en el Top Tab (que no los trae por defecto)
        tabBarShowIcon: true,
      }}
    >
      <MaterialTabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Home size={22} color={color} strokeWidth={2} />,
        }}
      />
      <MaterialTabs.Screen
        name="bloques"
        options={{
          title: 'Bolsillos',
          tabBarIcon: ({ color }) => <Layers size={22} color={color} strokeWidth={2} />,
        }}
      />
      <MaterialTabs.Screen
        name="reportes"
        options={{
          title: 'Reportes',
          tabBarIcon: ({ color }) => <PieChart size={22} color={color} strokeWidth={2} />,
        }}
      />
      <MaterialTabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <User size={22} color={color} strokeWidth={2} />,
        }}
      />
    </MaterialTabs>
  );
}

