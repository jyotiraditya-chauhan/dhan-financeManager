import {createNavigationContainerRef} from '@react-navigation/native';
import {RootStackParamList} from './RouterConfig';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const NavigationService = {
  navigate<T extends keyof RootStackParamList>(
    name: T,
    params?: RootStackParamList[T],
  ) {
    if (navigationRef.isReady()) {
      navigationRef.navigate(name as any, params as any);
    }
  },

  goBack() {
    if (navigationRef.isReady() && navigationRef.canGoBack()) {
      navigationRef.goBack();
    }
  },
};
