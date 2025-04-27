import {
	AtLeastTwoStrings,
	BobaColors,
	BobaGradientColors,
} from "@/constants/BobaColors"
import { BobaEmojis } from "@/constants/BobaEmojis"
import { Colors } from "@/constants/Colors"
import { BobaDeal, Store, StoreDeal } from "@/constants/types/Deals"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import Octicons from "@expo/vector-icons/Octicons"
import { LinearGradient } from "expo-linear-gradient"
import React, { useMemo } from "react"
import { StyleSheet, View } from "react-native"
import { ThemedText } from "./ThemedText"
import {
	isDealExpired,
	makeDealText,
	makeDrinkList,
	makePromoPeriodText,
	makeStoreAddress,
} from "./helpers/dealHelpers"
import { useIsMobileDevice } from "./helpers/deviceHelpers"
type BobaDealProps = {
	deal: BobaDeal
	store: Store | undefined
	storeDeals?: StoreDeal[]
}

function chooseBobaColor(drinkName: string): AtLeastTwoStrings {
	const normalizeDrinkName = drinkName.toLowerCase()

	for (const color in BobaColors) {
		const keywordTier = BobaColors[color]
		if (
			keywordTier.primary.some((keyword) =>
				normalizeDrinkName.includes(keyword),
			)
		) {
			return BobaGradientColors[color]
		}
	}

	for (const color in BobaColors) {
		const keywordTier = BobaColors[color]
		if (
			keywordTier.secondary.some((keyword) =>
				normalizeDrinkName.includes(keyword),
			)
		) {
			return BobaGradientColors[color]
		}
	}

	return [Colors.shared.bobaBrownLight, Colors.shared.bobaBrown]
}

function chooseBobaListEmoji(drinkName: string) {
	const drinkWords = drinkName.toLowerCase().split(" ")

	for (const word of drinkWords) {
		if (word in BobaEmojis) {
			return BobaEmojis[word]
		}
	}

	return "🧋"
}

export default function BobaDealCard({
	deal,
	store,
	storeDeals,
}: BobaDealProps) {
	const drinksList = useMemo(() => makeDrinkList(deal.drinks), [deal.drinks])
	const isMobileDevice = useIsMobileDevice()

	const ICON_SIZE = 24

	return (
		<LinearGradient
			colors={["white", "white"]}
			style={{
				...styles.dealContainer,
				shadowColor: chooseBobaColor(deal.drinks[0].name)[0],
				flexDirection: isMobileDevice ? "column" : "row",
			}}
			locations={[0, 0.05]}
			start={{ x: 0.5, y: 0 }}
			end={{ x: 0.5, y: 1 }}
		>
			<View
				style={{
					...(!isMobileDevice
						? styles.flexOne
						: { marginBottom: 10 }),
				}}
			>
				{/* TODO: yeah i want to do seperate columns but im lazy rn */}
				{isDealExpired(deal) && (
					<ThemedText type="subtitle" style={{ color: "red" }}>
						EXPIRED
					</ThemedText>
				)}
				<ThemedText type="subtitle">{store?.name}</ThemedText>
				<ThemedText type="default">{makeDealText(deal)}</ThemedText>
				<View style={styles.drinkList}>
					{drinksList.map((drink, ind) => {
						return (
							<>
								<ThemedText
									key={deal.dealID + drink.name}
									style={styles.drinkItem}
								>
									<View
										style={{
											backgroundColor: chooseBobaColor(
												drink.name,
											)[0],
											width: "102%",
											height: 22,
											position: "absolute",
											zIndex: -1,
										}}
									/>
									{chooseBobaListEmoji(drink.name)}{" "}
									{drink.name}
								</ThemedText>
							</>
						)
					})}
				</View>
			</View>
			{isMobileDevice && <View style={styles.dividerLine} />}

			<View style={{ ...(!isMobileDevice ? styles.flexOne : {}) }}>
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

				{deal.notes && (
					<>
						{!isMobileDevice && <View style={styles.dividerLine} />}
						<ThemedText type="default">
							<View style={styles.flexChild}>
								<View
									style={{
										flex: 0.08,
										marginRight: isMobileDevice ? 10 : 0,
									}}
								>
									<FontAwesome5
										name="sticky-note"
										size={ICON_SIZE}
										color="black"
									/>{" "}
								</View>
								<View style={{ flex: 1 }}>{deal.notes}</View>
							</View>
						</ThemedText>
					</>
				)}
			</View>
		</LinearGradient>
	)
}

const styles = StyleSheet.create({
	dealContainer: {
		display: "flex",
		justifyContent: "space-between",
		padding: 20,
		borderRadius: 20,
		margin: 10,
		// shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		// shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 4,
	},
	dividerLine: {
		borderBottomColor: "black",
		borderBottomWidth: StyleSheet.hairlineWidth,
		marginBottom: 10,
		marginTop: 10,
	},
	drinkList: {
		paddingLeft: 10,
		marginTop: 8,
		marginBottom: 5,
	},
	drinkItem: {
		marginVertical: 2,
		alignSelf: "flex-start",
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
