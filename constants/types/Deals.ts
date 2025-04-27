import { Timestamp } from "firebase/firestore"

export type Weekday =
	| "monday"
	| "tuesday"
	| "wednesday"
	| "thursday"
	| "friday"
	| "saturday"
	| "sunday" // 7 days a week

export const weekdayMap = {
	monday: 1,
	tuesday: 2,
	wednesday: 3,
	thursday: 4,
	friday: 5,
	saturday: 6,
	sunday: 0,
}

export type DayCondition = {
	day: Weekday
}

export type DateCondition = {
	date: number
}

export type PromoPeriod = {
	startDate: Timestamp | "always"
	endDate: Timestamp | "always"
	condition?: DayCondition | DateCondition
}

export type DiscountType = "percentage" | "flatoff" | "total"

export type Discount = {
	discountType: DiscountType
	discountValue: number
}

export function compareDiscounts(a: Discount, b: Discount): number {
	if (a.discountType < b.discountType) return -1
	if (a.discountType > b.discountType) return 1

	if (a.discountValue < b.discountValue) return -1
	if (a.discountValue > b.discountValue) return 1

	return 0
}

// DEALS FOR DRINKS
export type BobaDealType = "single" | "bogo" | "buyXforY" | "other"
export type DrinkType = "milktea" | "fruittea" | "slush" | "other"
export type DrinkSize = "regular" | "large" | "any"

export type Drink = {
	name: string
	type: DrinkType
	size: DrinkSize
	drinkIndex: number // index of the drink in the deal
}

export type Deal = {
	dealID: string
	storeID: string
	promoPeriod: PromoPeriod
	discount: Discount
	notes?: string
}

export type BobaDeal = Deal & {
	dealType: BobaDealType
	drinks: Drink[]
}

export type StoreDeal = Deal & {
	condition: Condition
}

export function isBobaDeal(deal: Deal): deal is BobaDeal {
	return (deal as BobaDeal).dealType !== undefined
}

export function isStoreDeal(deal: Deal): deal is StoreDeal {
	return (deal as StoreDeal).condition !== undefined
}

export type City = "waterloo" | "kitchener"

// DEALS FOR STORES
export type Store = {
	id: string
	name: string
	address: string // street address
	city: City
}

export type Condition = {
	id: string
	clause: string
	notes?: string
}
