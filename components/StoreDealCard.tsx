import { AtLeastTwoStrings, BobaGradientColors } from "@/constants/BobaColors"
import { Colors } from "@/constants/Colors"
import { Store, StoreDeal } from "@/constants/types/Deals"
import { LinearGradient } from "expo-linear-gradient"
import { ActivityIndicator, StyleSheet, View } from "react-native"
import { ThemedText } from "./ThemedText"
import { makeDealText, makePromoPeriodText } from "./helpers/dealHelpers"

type StoreDealProps = {
	deal: StoreDeal
	store: Store | undefined
}

/**
 * From ChatGPT:
 * Simple hash function (djb2 algorithm) to convert a string into a numeric hash.
 * @param str - The input string to hash.
 * @returns A numeric hash value.
 */
function hashString(str: string): number {
	let hash = 5381
	for (let i = 0; i < str.length; i++) {
		hash = hash * 33 + str.charCodeAt(i)
		hash = hash & hash
	}
	return Math.abs(hash)
}

/**
 * From ChatGPT:
 * Selects a deterministic color array from BobaGradientColors based on the input string.
 * @param input - The input string to base the color selection on.
 * @returns A tuple containing two color strings.
 */
function getColorForString(input: string): AtLeastTwoStrings {
	const keys = Object.keys(BobaGradientColors)
	const hash = hashString(input)
	const index = hash % keys.length
	const selectedKey = keys[index]
	return BobaGradientColors[selectedKey]
}

export default function StoreDealCard({ deal, store }: StoreDealProps) {
	const notes = deal.condition.notes

	if (!store) {
		return (
			<ActivityIndicator size="small" color={Colors.shared.bobaBrown} />
		)
	}

	return (
		<LinearGradient
			colors={getColorForString(deal.condition.id)}
			style={styles.dealContainer}
			locations={[0, 0.05]}
			start={{ x: 0.5, y: 0 }}
			end={{ x: 0.5, y: 1 }}
		>
			<ThemedText type="subtitle">{store?.name}</ThemedText>
			<ThemedText type="defaultBold">{deal.condition.clause}</ThemedText>
			<ThemedText type="default">🎉 {makeDealText(deal)}</ThemedText>
			<View style={styles.dividerLine} />
			<ThemedText type="default">
				📅 {makePromoPeriodText(deal.promoPeriod)}
			</ThemedText>
			{notes && <ThemedText type="default">📝 {notes}</ThemedText>}
		</LinearGradient>
	)
}

const styles = StyleSheet.create({
	dealContainer: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		padding: 20,
		borderRadius: 20,
		margin: 10,
		filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
	},
	dividerLine: {
		borderBottomColor: "white",
		borderBottomWidth: StyleSheet.hairlineWidth,
		marginBottom: 10,
		marginTop: 10,
	},
})
