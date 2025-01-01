import { DESKTOP_WIDTH_BREAKPOINT } from "@/constants/Breakpoints"
import { Platform, useWindowDimensions } from "react-native"

export function isMobileDevice() {
	return useWindowDimensions().width < DESKTOP_WIDTH_BREAKPOINT
}

export function isDesktop() {
	return (
		Platform.OS === "web" &&
		useWindowDimensions().width >= DESKTOP_WIDTH_BREAKPOINT
	)
}

export function isAndroid() {
	return Platform.OS === "android"
}

export function isWeb() {
	return Platform.OS === "web"
}
