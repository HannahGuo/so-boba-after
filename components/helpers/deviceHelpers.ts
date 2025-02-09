import { DESKTOP_WIDTH_BREAKPOINT } from "@/constants/Breakpoints"
import { Platform, useWindowDimensions } from "react-native"

export function useIsMobileDevice() {
	return useWindowDimensions().width < DESKTOP_WIDTH_BREAKPOINT
}

export function useIsDesktop() {
	const { width } = useWindowDimensions()
	return Platform.OS === "web" && width >= DESKTOP_WIDTH_BREAKPOINT
}

export function isAndroid() {
	return Platform.OS === "android"
}

export function isWeb() {
	return Platform.OS === "web"
}
