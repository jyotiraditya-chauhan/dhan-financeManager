import React, {useEffect} from 'react';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {navigationRef} from './NavigationService';
import {RootStackParamList, Routes} from './RouterConfig';
import BottomTabNavigator from './BottomTabNavigator';
import AddTransactionScreen from '../core/addTransaction/AddTransactionScreen';
import FloatingFAB from './FloatingFAB';
import {useTransactionStore} from '../store/useTransactionStore';
import {useAppTheme} from '../config/theme/AppTheme';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const {theme} = useAppTheme();
  const loadTransactions = useTransactionStore(s => s.loadTransactions);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <View style={{flex: 1}}>
      <NavigationContainer ref={navigationRef} theme={{
        dark: false,
        colors: {
          primary: theme.primary,
          background: theme.background,
          card: theme.surface,
          text: theme.textPrimary,
          border: theme.border,
          notification: theme.primary,
        },
      }}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name={Routes.BOTTOM_TABS} component={BottomTabNavigator} />
          <Stack.Screen
            name={Routes.ADD_TRANSACTION}
            component={AddTransactionScreen}
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <FloatingFAB />
    </View>
  );
};

export default AppNavigator;
