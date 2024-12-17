import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { Stack } from 'expo-router';
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    LondrinaSolid: require('../assets/fonts/LondrinaSolid-Regular.ttf'),
    CourierPrime: require('../assets/fonts/CourierPrime-Regular.ttf'),
    CourierPrimeBold: require('../assets/fonts/CourierPrime-Bold.ttf'),
    CourierPrimeItalic: require('../assets/fonts/CourierPrime-Italic.ttf'),
  })

  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="add" options={{ title: 'Add' }} />
    </Stack>
  );
}
