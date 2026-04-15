import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { MainNavigator } from './src/navigation/MainNavigator';
import { theme } from './src/theme/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.background}
      />
      <MainNavigator />
    </SafeAreaProvider>
  );
}

export default App;
