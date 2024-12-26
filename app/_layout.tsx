import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import React, { useEffect } from "react"

import { Stack } from "expo-router"

SplashScreen.preventAutoHideAsync().catch((e) => {
	console.warn("Failed to prevent splash screen auto-hide:", e)
})

export default function RootLayout() {
	const [fontsLoaded, error] = useFonts({
		LondrinaSolid: require("../assets/fonts/LondrinaSolid-Regular.ttf"),
		CourierPrime: require("../assets/fonts/CourierPrime-Regular.ttf"),
		CourierPrimeBold: require("../assets/fonts/CourierPrime-Bold.ttf"),
		CourierPrimeItalic: require("../assets/fonts/CourierPrime-Italic.ttf"),
	})

	useEffect(() => {
		if (fontsLoaded) {
			SplashScreen.hideAsync().catch((e) => {
				console.warn("Failed to hide splash screen:", e)
			})
		}
	}, [fontsLoaded])

	useEffect(() => {
		if (error) {
			console.error("Error loading fonts:", error)
			SplashScreen.hideAsync()
		}
	}, [error])

	if (!fontsLoaded) {
		return null
	}

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="index" options={{ title: "Home" }} />
			<Stack.Screen name="add" options={{ title: "Add" }} />
		</Stack>
	)
}
