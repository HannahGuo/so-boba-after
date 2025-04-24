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

const sharedStyles = {
	fontFamily: "Fredoka",
	color: "black",
}

const styles = StyleSheet.create({
	default: {
		fontSize: 18,
		...sharedStyles,
	},
	defaultBold: {
		fontSize: 18,
		fontWeight: "500",
		...sharedStyles,
	},
	title: {
		fontSize: 48,
		fontWeight: "500",
		...sharedStyles,
	},
	subtitle: {
		fontSize: 36,
		fontWeight: "500",
		...sharedStyles,
	},
	subsubtitle: {
		fontSize: 28,
		fontWeight: "500",
		...sharedStyles,
	},
	link: {
		color: "white",
		fontSize: 18,
		fontFamily: "Fredoka",
		textDecorationLine: "underline",
		marginTop: 3,
	},
	tiny: {
		fontSize: 12,
		...sharedStyles,
	},
})
