import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { MainNavigator } from './src/navigation/MainNavigator';
import { theme } from './src/theme/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.colors.background}
        />
        <MainNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
