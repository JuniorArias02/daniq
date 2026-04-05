import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
  useSafeArea?: boolean;
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
}

export default function BaseLayout({ 
  children, 
  className = "", 
  useSafeArea = true,
  edges = ['top'] // Default to top only to avoid double-padding the bottom with the tab bar
}: BaseLayoutProps) {
  const { isDarkMode } = useTheme();
  
  // Condicionalmente renderizamos con SafeAreaView o View
  if (useSafeArea) {
    return (
      <SafeAreaView edges={edges} className={`flex-1 ${isDarkMode ? 'bg-dark-bg' : 'bg-slate-50'} ${className}`}>
        <StatusBar 
          barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
          backgroundColor={isDarkMode ? '#0D1117' : '#F8FAFC'} 
        />
        {children}
      </SafeAreaView>
    );
  }

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-dark-bg' : 'bg-slate-50'} ${className}`}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={isDarkMode ? '#0D1117' : '#F8FAFC'} 
      />
      {children}
    </View>
  );
}
