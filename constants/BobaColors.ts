// A mapping of colors to related drinks, so that the cards
// can be colored based on the drink type

import { Colors } from "./Colors"

type KeywordTier = {
	primary: string[] // prioritize these
	secondary: string[] // use these as fallback
}

export const BobaColors: Record<string, KeywordTier> = {
	red: {
		primary: ["grapefruit", "strawberry", "cranberry"],
		secondary: [],
	},
	orange: {
		primary: ["peach", "thai milk tea", "orange"],
		secondary: [],
	},
	yellow: {
		primary: ["mango", "passionfruit", "passion fruit", "lemon"],
		secondary: [],
	},
	green: {
		primary: ["matcha", "honeydew", "pandan", "lime", "wintermelon"],
		secondary: ["green", "oolong"],
	},
	blue: {
		primary: ["blueberry"],
		secondary: [],
	},
	purple: {
		primary: ["taro", "ube", "lavender"],
		secondary: [],
	},
	pink: {
		primary: ["strawberry milk"],
		secondary: [],
	},
	brown: {
		primary: [
			"brown sugar",
			"3 guys",
			"2 ladies",
			"caramel",
			"chocolate",
			"coffee",
			"latte",
			"trio",
			"hojicha",
		],
		secondary: ["milk", "black tea"],
	},
}

export type AtLeastTwoStrings = [string, string, ...string[]]

export const BobaGradientColors: Record<string, AtLeastTwoStrings> = {
	red: ["#FFD9D9", Colors.shared.bobaRed],
	orange: ["#FFD9D9", Colors.shared.bobaOrange],
	yellow: ["#FFD9D9", Colors.shared.bobaYellow],
	green: ["#D9FFD9", Colors.shared.bobaGreen],
	blue: ["#D9D9FF", Colors.shared.bobaBlue],
	purple: ["#F1DCFF", Colors.shared.bobaPurple],
	pink: ["#FFE3F7", Colors.shared.bobaPink],
	brown: ["#EFB660", Colors.shared.bobaBrownDark],
}
