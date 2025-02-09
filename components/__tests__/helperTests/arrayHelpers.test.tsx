// drinkArraysEqual.test.ts

import { drinkArraysEqual } from "@/components/helpers/arrayHelpers"
import { Drink } from "@/constants/types/Deals"

// generated these with chatgpt :)

// For testing purposes, define a minimal Drink type.
// In your project, Drink is imported from "@/constants/types/Deals"}

describe("drinkArraysEqual", () => {
	// Create some sample drinks.
	const coke: Drink = {
		name: "Coke",
		type: "milktea",
		size: "regular",
		drinkIndex: 0,
	}
	const pepsi: Drink = {
		name: "Pepsi",
		type: "milktea",
		size: "regular",
		drinkIndex: 0,
	}
	const sprite: Drink = {
		name: "Sprite",
		type: "milktea",
		size: "regular",
		drinkIndex: 0,
	}

	it("should return true for two empty arrays", () => {
		expect(drinkArraysEqual([], [])).toBe(true)
	})

	it("should return true when arrays have the same elements in the same order", () => {
		const arr1: Drink[] = [coke, pepsi]
		const arr2: Drink[] = [
			{
				name: "Coke",
				type: "milktea",
				size: "regular",
				drinkIndex: 0,
			},
			{
				name: "Pepsi",
				type: "milktea",
				size: "regular",
				drinkIndex: 0,
			},
		]
		expect(drinkArraysEqual(arr1, arr2)).toBe(true)
	})

	it("should return false when arrays have the same length but different elements", () => {
		const arr1: Drink[] = [coke, pepsi]
		const arr2: Drink[] = [coke, sprite]
		expect(drinkArraysEqual(arr1, arr2)).toBe(false)
	})

	it("should return false when arrays have the same elements in a different order", () => {
		const arr1: Drink[] = [coke, pepsi]
		const arr2: Drink[] = [pepsi, coke]
		expect(drinkArraysEqual(arr1, arr2)).toBe(false)
	})

	it("should return true if the first array is empty (even if the second array is non-empty)", () => {
		// Because Array.every on an empty array returns true.
		const arr1: Drink[] = []
		const arr2: Drink[] = [coke]
		expect(drinkArraysEqual(arr1, arr2)).toBe(true)
	})

	it("should throw an error if the first array has elements but the second is empty", () => {
		const arr1: Drink[] = [coke]
		const arr2: Drink[] = []
		// At index 0, b[0] is undefined so attempting to access b[0].name throws.
		expect(() => drinkArraysEqual(arr1, arr2)).toThrow()
	})

	it("should return true when both arrays are the same object", () => {
		const arr1: Drink[] = [coke, pepsi]
		expect(drinkArraysEqual(arr1, arr1)).toBe(true)
	})

	it("should return true when the second array has extra elements (only the first array's length is considered)", () => {
		const arr1: Drink[] = [coke, pepsi]
		const arr2: Drink[] = [coke, pepsi, sprite]
		expect(drinkArraysEqual(arr1, arr2)).toBe(true)
	})
})
