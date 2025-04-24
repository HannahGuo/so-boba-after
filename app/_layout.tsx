import { useFonts } from "expo-font"
import React, { useEffect } from "react"

import { SplashScreen, Stack } from "expo-router"

SplashScreen.preventAutoHideAsync().catch((_) => {})

export default function RootLayout() {
	const [fontsLoaded, error] = useFonts({
		Fredoka: require("../assets/fonts/Fredoka-VariableFont_wdth,wght.ttf"),
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
