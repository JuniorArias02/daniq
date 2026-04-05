import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
  useSafeArea?: boolean;
}

export default function BaseLayout({ 
  children, 
  className = "", 
  useSafeArea = true 
}: BaseLayoutProps) {
  const { isDarkMode } = useTheme();
  const Container = useSafeArea ? SafeAreaView : View;

  return (
    <Container className={`flex-1 ${isDarkMode ? 'bg-dark-bg' : 'bg-slate-50'} ${className}`}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={isDarkMode ? '#0D1117' : '#F8FAFC'} 
      />
      {children}
    </Container>
  );
}
