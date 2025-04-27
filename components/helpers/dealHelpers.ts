import {
	BobaDeal,
	Discount,
	Drink,
	PromoPeriod,
	Store,
	StoreDeal,
} from "@/constants/types/Deals"
import { capitalizeFirstLetter, drinkArraysEqual } from "./arrayHelpers"
import { getNewDateWithNoTime } from "./dateHelpers"

export function makeSizeText(size: string, dealType: string): string {
	if (size === "any") {
		return "any size"
	}

	if (dealType === "single") {
		return size + " size"
	}

	return size
}

export function makeDealText(deal: BobaDeal | StoreDeal): string {
	function makeDiscountText(discount: Discount) {
		const discountValue = discount.discountValue
		switch (discount.discountType) {
			case "percentage":
				if (discountValue === 100) {
					return "free"
				}
				return `${discountValue}% off`
			case "flatoff":
				return `$${discountValue} off`
			case "total":
				if (discountValue % 1 !== 0) {
					return `for $${discountValue.toFixed(2)}`
				}

				return `for $${discountValue}`
			default:
				return "Unknown discount type"
		}
	}

	if ("drinks" in deal) {
		switch (deal.dealType) {
			case "single":
				return (
					makeDiscountText(deal.discount) +
					" (" +
					makeSizeText(deal.drinks[0].size, deal.dealType) +
					")"
				)
			case "bogo":
				return (
					"buy one (" +
					makeSizeText(deal.drinks[0].size, deal.dealType) +
					") get one " +
					makeDiscountText(deal.discount) +
					" (" +
					makeSizeText(deal.drinks[1].size, deal.dealType) +
					")"
				)
			case "buyXforY":
				return (
					"buy any 2 " +
					makeSizeText(deal.drinks[0].size, deal.dealType) +
					" " +
					makeDiscountText(deal.discount)
				)
			case "other":
			default:
				return "Other"
		}
	}

	return makeDiscountText(deal.discount)
}

export function makePromoPeriodText(promoPeriod: PromoPeriod): string {
	if (promoPeriod.condition) {
		if ("date" in promoPeriod.condition) {
			return `Every ${promoPeriod.condition.date}th of the month`
		}

		if ("day" in promoPeriod.condition) {
			return `Every ${
				promoPeriod.condition.day[0].toLocaleUpperCase() +
				promoPeriod.condition.day.substring(1)
			}`
		}
	}

	if (
		promoPeriod.startDate === "always" ||
		promoPeriod.endDate === "always"
	) {
		return "Always"
	}

	const startDate: string = promoPeriod.startDate
		.toDate()
		.toLocaleDateString("en-US", {
			weekday: "long", // e.g. "Sunday"
			month: "short", // e.g. "Dec"
			day: "numeric", // e.g. "22"
		})

	const endDate: string = promoPeriod.endDate
		.toDate()
		.toLocaleDateString("en-US", {
			weekday: "long", // e.g. "Sunday"
			month: "short", // e.g. "Dec"
			day: "numeric", // e.g. "22"
		})

	return `${startDate} to ${endDate}`
}

export function isDealExpired(deal: BobaDeal | StoreDeal): boolean {
	if ("promoPeriod" in deal) {
		const today = getNewDateWithNoTime()
		if (deal.promoPeriod.startDate === "always") {
			return false
		}

		if (deal.promoPeriod.endDate === "always") {
			return false
		}

		if (getNewDateWithNoTime(deal.promoPeriod.endDate.toDate()) < today) {
			return true
		}
	}

	return false
}

export function makeDrinkList(drinks: Drink[]): Drink[] {
	let drinkNumToList: Record<number, Drink[]> = {}

	let hasRepeat = false // this is scuffed but trust

	for (const drink of drinks) {
		if (!drinkNumToList[drink.drinkIndex]) {
			drinkNumToList[drink.drinkIndex] = []
		} else {
			hasRepeat = true
		}

		drinkNumToList[drink.drinkIndex].push(drink)
	}

	// TODO: hardcoding 2 for now
	if (Object.keys(drinkNumToList).length === 2) {
		if (drinkArraysEqual(drinkNumToList[0], drinkNumToList[1])) {
			// this is a "2 for X" deal
			return drinkNumToList[0]
		}
	}

	if (!hasRepeat && drinks.length > 1) {
		for (let i = 0; i < drinks.length; i++) {
			drinkNumToList[i][0].name =
				`Drink for req. ${i + 1}: ` + drinkNumToList[i][0].name
		}
	}

	return drinks
}

export function makeStoreAddress(store?: Store): string {
	if (!store) {
		return ""
	}

	return (
		(store?.address ?? "") + ", " + capitalizeFirstLetter(store?.city ?? "")
	)
}
