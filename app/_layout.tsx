import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { StyleSheet, View } from 'react-native';
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    LondrinaSolid: require('../assets/fonts/LondrinaSolid-Regular.ttf'),
    CourierPrime: require('../assets/fonts/CourierPrime-Regular.ttf'),
    CourierPrimeBold: require('../assets/fonts/CourierPrime-Bold.ttf'),
    CourierPrimeItalic: require('../assets/fonts/CourierPrime-Italic.ttf'),
  })

  return (
    <View style={styles.mainContainer}>
      <ThemedText type='title'>...so boba after?</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    backgroundColor: Colors.light.background,
  },
});