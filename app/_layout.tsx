import { useFonts } from "expo-font"
import React, { useEffect } from "react"

import { SplashScreen, Stack } from "expo-router"

SplashScreen.preventAutoHideAsync().catch((_) => {})

export default function RootLayout() {
	const [fontsLoaded, error] = useFonts({
		LondrinaSolid: require("../assets/fonts/LondrinaSolid-Regular.ttf"),
		CourierPrime: require("../assets/fonts/CourierPrime-Regular.ttf"),
		CourierPrimeBold: require("../assets/fonts/CourierPrime-Bold.ttf"),
		CourierPrimeItalic: require("../assets/fonts/CourierPrime-Italic.ttf"),
	})

	useEffect(() => {
		if (fontsLoaded) {
			SplashScreen.hideAsync().catch((_) => {})
		}
	}, [fontsLoaded])

	useEffect(() => {
		if (error) {
			SplashScreen.hideAsync()
		}
	}, [error])

	if (!fontsLoaded) {
		return null
	}

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<meta name="description" content="A boba discount tracker." />
			<Stack.Screen name="index" options={{ title: "Home" }} />
			<Stack.Screen name="add" options={{ title: "Add" }} />
		</Stack>
	)
}
