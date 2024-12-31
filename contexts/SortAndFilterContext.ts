import { createContext } from "react"

export type SortType = "storeName" | "expiry" | "price"

export type NumberOfDrinks = "any" | "one" | "two"

export const SortAndFilterContext = createContext<{
	sortType: SortType
	setSortType: (sortType: SortType) => void
	numberOfDrinks: NumberOfDrinks
	setNumberOfDrinks: (numberOfDrinks: NumberOfDrinks) => void
}>({
	sortType: "storeName",
	setSortType: () => {},
	numberOfDrinks: "any",
	setNumberOfDrinks: () => {},
})
