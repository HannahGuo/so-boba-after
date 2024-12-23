import { Colors } from "@/constants/Colors"
import React from "react"
import { StyleSheet, View } from "react-native"
import { ThemedText } from "./ThemedText"

export default function SortAndFilterBar() {
	return (
		<View style={styles.container}>
			<ThemedText>Sort and Filter</ThemedText>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 14,
		backgroundColor: Colors.shared.bobaBrown,
		width: "100%",
		position: "sticky",
		bottom: 0,
	},
})
