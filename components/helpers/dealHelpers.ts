import {
	BobaDeal,
	Discount,
	Drink,
	PromoPeriod,
	StoreDeal,
} from "@/constants/types/Deals"
import { drinkArraysEqual } from "./arrayHelpers"

export function makeSizeText(size: string) {
	if (size === "any") {
		return "any size"
	}

	return size
}

export function makeDealText(deal: BobaDeal | StoreDeal): string {
	function makeDiscountText(discount: Discount) {
		if (discount.discountValue === 0) {
			return "free"
		}

		switch (discount.discountType) {
			case "percentage":
				return `${discount.discountValue}% off`
			case "flatoff":
				return `$${discount.discountValue} off`
			case "total":
				return `for $${discount.discountValue}`
			default:
				return "Unknown discount type"
		}
	}

	if ("drinks" in deal) {
		switch (deal.dealType) {
			case "single":
				return (
					makeSizeText(deal.drinks[0].size) +
					" " +
					makeDiscountText(deal.discount)
				)
			case "bogo":
				return "buy one get one " + makeDiscountText(deal.discount)
			case "buyXforY":
				return (
					"buy any 2 " +
					makeSizeText(deal.drinks[0].size) +
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
		const today = new Date()

		if (deal.promoPeriod.startDate === "always") {
			return false
		}

		if (deal.promoPeriod.endDate === "always") {
			return false
		}

		if (deal.promoPeriod.endDate.toDate() < today) {
			return true
		}
	}

	return false
}

export function makeDrinkList(drinks: Drink[]): Drink[] {
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
