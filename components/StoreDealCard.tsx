import { AtLeastTwoStrings, BobaGradientColors } from "@/constants/BobaColors"
import { Colors } from "@/constants/Colors"
import { Store, StoreDeal } from "@/constants/types/Deals"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import Octicons from "@expo/vector-icons/Octicons"
import { LinearGradient } from "expo-linear-gradient"
import React from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"
import { ThemedText } from "./ThemedText"
import {
	makeDealText,
	makePromoPeriodText,
	makeStoreAddress,
} from "./helpers/dealHelpers"
import { useIsMobileDevice } from "./helpers/deviceHelpers"

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
	const ICON_SIZE = 24

	const isMobileDevice = useIsMobileDevice()

	if (!store) {
		return (
			<ActivityIndicator size="small" color={Colors.shared.bobaBrown} />
		)
	}

	return (
		<LinearGradient
			colors={["white", "white"]}
			style={{
				...styles.dealContainer,
				flexDirection: isMobileDevice ? "column" : "row",
			}}
			locations={[0, 0.05]}
			start={{ x: 0.5, y: 0 }}
			end={{ x: 0.5, y: 1 }}
		>
			<View style={{ flex: 1, flexDirection: "column" }}>
				<ThemedText type="subtitle">{store?.name}</ThemedText>
				<ThemedText type="defaultBold">
					{deal.condition.clause}
				</ThemedText>
				<View style={{ padding: 5 }} />
				<ThemedText type="default">🎉 {makeDealText(deal)}</ThemedText>
				{isMobileDevice && <View style={styles.dividerLine} />}
			</View>
			<View
				style={{
					...(!isMobileDevice
						? styles.flexOne
						: { marginBottom: 10 }),
				}}
			>
				<ThemedText type="default">
					<View style={styles.flexChild}>
						<View
							style={{
								flex: 0.08,
								marginRight: isMobileDevice ? 10 : 0,
							}}
						>
							<Octicons
								name="home"
								size={ICON_SIZE}
								color="black"
							/>{" "}
						</View>
						<View style={{ flex: 1 }}>
							{makeStoreAddress(store)}
						</View>
					</View>
				</ThemedText>
				<ThemedText type="default">
					<View style={styles.flexChild}>
						<View
							style={{
								flex: 0.08,
								marginRight: isMobileDevice ? 10 : 0,
							}}
						>
							<FontAwesome5
								name="calendar"
								size={ICON_SIZE}
								color="black"
							/>
						</View>
						<View style={{ flex: 1 }}>
							{makePromoPeriodText(deal.promoPeriod)}
						</View>
					</View>
				</ThemedText>
			</View>
		</LinearGradient>
	)
}

const styles = StyleSheet.create({
	dealContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 20,
		borderRadius: 20,
		margin: 10,
		filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
	},
	dividerLine: {
		borderBottomColor: "black",
		borderBottomWidth: StyleSheet.hairlineWidth,
		marginBottom: 10,
		marginTop: 10,
	},
	flexOne: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
	},
	flexChild: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		paddingBottom: 15,
	},
})
