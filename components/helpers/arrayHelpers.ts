import { Drink } from "@/constants/types/Deals"

// compare if two arrays have the same elements
export const drinkArraysEqual = (a: Drink[], b: Drink[]) => {
	return a.every((val, idx) => val.name === b[idx].name)
}
