type Weekday =
	| "monday"
	| "tuesday"
	| "wednesday"
	| "thursday"
	| "friday"
	| "saturday"
	| "sunday" // 7 days a week

type DayCondition = {
	day: Weekday
}

type DateCondition = {
	date: number
}

type PromoPeriod = {
	startDate: Date | "always"
	endDate: Date | "always"
	condition?: DayCondition | DateCondition
}

type DiscountType = "percentage" | "flatoff" | "total"

type Discount = {
	discountType: DiscountType
	discountValue: number
}

// DEALS FOR DRINKS
type BobaDealType = "single" | "bogo" | "buyXforY" | "other"
type DrinkType = "milktea" | "fruittea" | "slush" | "other"
type DrinkSize = "regular" | "large" | "any"

type Drink = {
	name: string
	type: DrinkType
	size: DrinkSize
	drinkIndex: number // index of the drink in the deal
}

type BobaDeal = {
	id: string
	storeID: string
	dealType: BobaDealType
	discount: Discount
	drinks: Drink[]
	promoPeriod: PromoPeriod
	notes: string
}

// DEALS FOR STORES
type Store = {
	id: string
	name: string
	address: string
}

type Condition = {
	id: string
	clause: string
}

type StoreDeal = {
	id: string
	storeID: string
	condition: Condition
	promoPeriod: PromoPeriod
	discount: Discount
}
