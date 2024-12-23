import {
	BobaDeal,
	Discount,
	PromoPeriod,
	StoreDeal,
} from "@/constants/types/Deals"

export function makeSizeText(size: string) {
	if (size === "any") {
		return "any size"
	}

	return size
}

export function makeDealText(deal: BobaDeal | StoreDeal): string {
	function makeDiscountText(discount: Discount) {
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
				return makeDiscountText(deal.discount)
			case "bogo":
				return "Buy one get one " + makeDealText(deal)
			case "buyXforY":
				return (
					"Buy any 2 " +
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
			return `Every ${promoPeriod.condition.day}`
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