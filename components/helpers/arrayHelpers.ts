import { Drink } from "@/constants/types/Deals"

// compare if two arrays have the same elements
export const drinkArraysEqual = (a: Drink[], b: Drink[]) => {
	return a.every((val, idx) => val.name === b[idx].name)
}

export const capitalizeFirstLetter = (val: string) => {
	return val.charAt(0).toUpperCase() + val.slice(1)
}
