import { StyleSheet, Text, type TextProps } from "react-native"

import { useThemeColor } from "@/hooks/useThemeColor"

export type ThemedTextProps = TextProps & {
	lightColor?: string
	darkColor?: string
	type?:
		| "default"
		| "title"
		| "defaultBold"
		| "subtitle"
		| "subsubtitle"
		| "link"
		| "tiny"
}

export function ThemedText({
	style,
	lightColor,
	darkColor,
	type = "default",
	...rest
}: ThemedTextProps) {
	const color = useThemeColor({ light: lightColor, dark: darkColor }, "text")

	return (
		<Text
			style={[
				{ color },
				type === "default" ? styles.default : undefined,
				type === "title" ? styles.title : undefined,
				type === "defaultBold" ? styles.defaultBold : undefined,
				type === "subtitle" ? styles.subtitle : undefined,
				type === "subsubtitle" ? styles.subsubtitle : undefined,
				type === "link" ? styles.link : undefined,
				type === "tiny" ? styles.tiny : undefined,
				style,
			]}
			{...rest}
		/>
	)
}

const styles = StyleSheet.create({
	default: {
		fontSize: 18,
		fontFamily: "CourierPrime",
	},
	defaultBold: {
		fontSize: 18,
		fontFamily: "CourierPrimeBold",
	},
	title: {
		fontSize: 80,
		fontFamily: "LondrinaSolid",
	},
	subtitle: {
		fontSize: 36,
		fontFamily: "LondrinaSolid",
	},
	subsubtitle: {
		fontSize: 28,
		fontFamily: "LondrinaSolid",
	},
	link: {
		color: "white",
		fontSize: 18,
		fontFamily: "CourierPrime",
		textDecorationLine: "underline",
		marginTop: 2,
	},
	tiny: {
		fontSize: 12,
		fontFamily: "CourierPrime",
	},
})
