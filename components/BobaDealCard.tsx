import { BobaColors } from "@/constants/BobaColors"
import { BobaEmojis } from "@/constants/BobaEmojis"
import { Colors } from "@/constants/Colors"
import { BobaDeal, Drink, Store, StoreDeal } from "@/constants/types/Deals"
import { StyleSheet, View } from "react-native"
import { ThemedText } from "./ThemedText"
import { drinkArraysEqual } from "./helpers/arrayHelpers"
import { makeDealText, makePromoPeriodText } from "./helpers/dealHelpers"

type BobaDealProps = {
	deal: BobaDeal
	store: Store | undefined
	storeDeals?: StoreDeal[]
}

function chooseBackgroundColor(drinkName: string) {
	const normalizeDrinkName = drinkName.toLowerCase()

	for (const color in BobaColors) {
		const keywordTier = BobaColors[color]
		if (
			keywordTier.primary.some((keyword) =>
				normalizeDrinkName.includes(keyword),
			)
		) {
			return `linear-gradient(to top, ${Colors.shared.bobaBrown}, 95%, ${Colors.shared.bobaBrownLight})`
		}
	}

	for (const color in BobaColors) {
		const keywordTier = BobaColors[color]
		if (
			keywordTier.secondary.some((keyword) =>
				normalizeDrinkName.includes(keyword),
			)
		) {
			return `linear-gradient(to top, ${Colors.shared.bobaBrown}, 95%, ${Colors.shared.bobaBrownLight})`
		}
	}

	return Colors.shared.bobaPurple
}

function makeDrinkList(drinks: Drink[]): Drink[] {
	const drinkNumToList: Record<number, Drink[]> = {}

	for (const drink of drinks) {
		if (!drinkNumToList[drink.drinkIndex]) {
			drinkNumToList[drink.drinkIndex] = []
		}

		drinkNumToList[drink.drinkIndex].push(drink)
	}

	// TODO: hardcoding 2 for now
	if (Object.keys(drinkNumToList).length == 2) {
		if (drinkArraysEqual(drinkNumToList[0], drinkNumToList[1])) {
			// this is a "2 for X" deal
			return drinkNumToList[0]
		}
	}

	return drinks
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
	const drinksList = makeDrinkList(deal.drinks)

	return (
		<View
			style={{
				backgroundImage: chooseBackgroundColor(deal.drinks[0].name),
				...styles.dealContainer,
			}}
		>
			<ThemedText type="subtitle">{store?.name}</ThemedText>
			<ThemedText type="defaultBold">{makeDealText(deal)}</ThemedText>
			<ThemedText type="default">
				<ul
					style={{
						listStyleType: "none",
						paddingLeft: 10,
					}}
				>
					{drinksList.map((drink) => {
						return (
							<li>
								{chooseBobaListEmoji(drink.name)} {drink.name}
							</li>
						)
					})}
				</ul>
			</ThemedText>
			<View style={styles.dividerLine} />
			<ThemedText type="default">
				📅 {makePromoPeriodText(deal.promoPeriod)}
			</ThemedText>
			<ThemedText type="default">📝 {deal.notes}</ThemedText>
		</View>
	)
}

const styles = StyleSheet.create({
	dealContainer: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		padding: 20,
		width: 460,
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
