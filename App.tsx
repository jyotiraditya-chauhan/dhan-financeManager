import React from 'react';
import {Platform, StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {AppThemeProvider, useAppTheme} from './src/config/theme/AppTheme';
import AppNavigator from './src/navigation/AppNavigator';

const AppContent = () => {
  const {theme, isDark} = useAppTheme();
  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={Platform.OS === 'android' ? theme.background : 'transparent'}
        translucent={Platform.OS === 'android' ? false : true}
      />
      <AppNavigator />
    </>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AppThemeProvider>
        <AppContent />
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
