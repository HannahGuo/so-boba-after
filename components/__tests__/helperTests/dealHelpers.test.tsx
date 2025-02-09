/* eslint-disable no-restricted-syntax */
// dealHelpers.test.ts

import { makeDrinkList, makeSizeText } from "@/components/helpers/dealHelpers"
import { Drink } from "@/constants/types/Deals"
// also chatgpt generated

// A dummy base for StoreDeal objects to satisfy required fields.
// const dummyStoreBase = {
// 	id: "dummyID",
// 	storeID: "dummyStoreID",
// 	conditionts: [],
// }

describe("makeSizeText", () => {
	it("should return 'any size' when size is 'any'", () => {
		expect(makeSizeText("any")).toBe("any size")
	})

	it("should return the input size when it is not 'any'", () => {
		expect(makeSizeText("small")).toBe("small")
		expect(makeSizeText("large")).toBe("large")
	})
})

// describe("makeDealText", () => {
// 	// Helper discounts
// 	const discountFree: Discount = {
// 		discountValue: 0,
// 		discountType: "percentage",
// 	}
// 	const discountPercentage: Discount = {
// 		discountValue: 20,
// 		discountType: "percentage",
// 	}
// 	const discountFlatOff: Discount = {
// 		discountValue: 5,
// 		discountType: "flatoff",
// 	}
// 	const discountTotal: Discount = { discountValue: 7, discountType: "total" }

// 	// Helper drinks
// 	const drinkAny: Drink = {
// 		name: "Tea",
// 		size: "any",
// 		drinkIndex: 0,
// 		type: "other",
// 	}
// 	const drinkSmall: Drink = {
// 		name: "Latte",
// 		size: "regular",
// 		drinkIndex: 0,
// 		type: "other",
// 	}

// 	describe("for deals without drinks (StoreDeal)", () => {
// 		it("should return 'free' when discount value is 0", () => {
// 			const deal: StoreDeal = {
// 				...dummyStoreBase,
// 				discount: discountFree,
// 				condition: {
// 					id: "",
// 					clause: "",
// 					notes: undefined,
// 				},
// 				promoPeriod: {
// 					startDate: Timestamp.fromDate(getNewDateWithNoTime()),
// 					endDate: Timestamp.fromDate(getNewDateWithNoTime()),
// 					condition: undefined,
// 				},
// 			}
// 			expect(makeDealText(deal)).toBe("free")
// 		})

// 		it("should return percentage discount text", () => {
// 			const deal: StoreDeal = {
// 				...dummyStoreBase,
// 				discount: discountPercentage,
// 				condition: {
// 					id: "",
// 					clause: "",
// 					notes: undefined,
// 				},
// 				promoPeriod: {
// 					startDate: Timestamp.fromDate(getNewDateWithNoTime()),
// 					endDate: Timestamp.fromDate(getNewDateWithNoTime()),
// 					condition: undefined,
// 				},
// 			}
// 			expect(makeDealText(deal)).toBe("20% off")
// 		})

// 		it("should return flat off discount text", () => {
// 			const deal: StoreDeal = {
// 				...dummyStoreBase,
// 				discount: discountFlatOff,
// 				condition: {
// 					id: "",
// 					clause: "",
// 					notes: undefined,
// 				},
// 				promoPeriod: {
// 					startDate: Timestamp.fromDate(getNewDateWithNoTime()),
// 					endDate: Timestamp.fromDate(getNewDateWithNoTime()),
// 					condition: undefined,
// 				},
// 			}
// 			expect(makeDealText(deal)).toBe("$5 off")
// 		})

// 		it("should return total discount text", () => {
// 			const deal: StoreDeal = {
// 				...dummyStoreBase,
// 				discount: discountTotal,
// 				condition: {
// 					id: "",
// 					clause: "",
// 					notes: undefined,
// 				},
// 				promoPeriod: {
// 					startDate: Timestamp.fromDate(getNewDateWithNoTime()),
// 					endDate: Timestamp.fromDate(getNewDateWithNoTime()),
// 					condition: undefined,
// 				},
// 			}
// 			expect(makeDealText(deal)).toBe("for $7")
// 		})
// 	})

// 	describe("for deals with drinks (BobaDeal)", () => {
// 		it("should return a single deal text", () => {
// 			// For a single deal, the text is: makeSizeText(drinks[0].size) + " " + discount text
// 			const deal: BobaDeal = {
// 				drinks: [drinkSmall],
// 				discount: discountFlatOff,
// 				dealType: "single",
// 				id: "",
// 				storeID: "",
// 				promoPeriod: {
// 					startDate: Timestamp.fromDate(getNewDateWithNoTime()),
// 					endDate: Timestamp.fromDate(getNewDateWithNoTime()),
// 					condition: undefined,
// 				},
// 				notes: "",
// 			}
// 			expect(makeDealText(deal)).toBe("small $5 off")
// 		})

// 		it("should return a bogo deal text", () => {
// 			// For bogo deals: "buy one get one " + discount text.
// 			const deal: BobaDeal = {
// 				drinks: [drinkAny],
// 				discount: discountPercentage,
// 				dealType: "bogo",
// 				id: "",
// 				storeID: "",
// 				promoPeriod: {
// 					startDate: Timestamp.fromDate(getNewDateWithNoTime()),
// 					endDate: Timestamp.fromDate(getNewDateWithNoTime()),
// 					condition: undefined,
// 				},
// 				notes: "",
// 			}
// 			expect(makeDealText(deal)).toBe("buy one get one 20% off")
// 		})

// 		it("should return a buyXforY deal text", () => {
// 			// For buyXforY deals: "buy any 2 " + makeSizeText(drinks[0].size) + " " + discount text.
// 			const deal: BobaDeal = {
// 				drinks: [drinkSmall],
// 				discount: discountTotal,
// 				dealType: "buyXforY",
// 				id: "",
// 				storeID: "",
// 				promoPeriod: {
// 					startDate: Timestamp.fromDate(getNewDateWithNoTime()),
// 					endDate: Timestamp.fromDate(getNewDateWithNoTime()),
// 					condition: undefined,
// 				},
// 				notes: "",
// 			}
// 			expect(makeDealText(deal)).toBe("buy any 2 small for $7")
// 		})

// 		it("should return 'Other' for unknown or 'other' deal types", () => {
// 			const deal: BobaDeal = {
// 				drinks: [drinkAny],
// 				discount: discountFree,
// 				dealType: "other",
// 				id: "",
// 				storeID: "",
// 				promoPeriod: {
// 					startDate: Timestamp.fromDate(getNewDateWithNoTime()),
// 					endDate: Timestamp.fromDate(getNewDateWithNoTime()),
// 					condition: undefined,
// 				},
// 				notes: "",
// 			}
// 			expect(makeDealText(deal)).toBe("Other")

// 			// Also, if dealType is not one of the handled cases, default to "Other"
// 			const dealUnknown: BobaDeal = {
// 				drinks: [drinkAny],
// 				discount: discountPercentage,
// 				// @ts-expect-error: intentionally using an unknown dealType for testing
// 				dealType: "somethingElse",
// 			}
// 			expect(makeDealText(dealUnknown)).toBe("Other")
// 		})
// 	})
// })

// describe("makePromoPeriodText", () => {
// 	const fakeStart = Timestamp.fromDate(new Date(2020, 0, 1))
// 	const fakeEnd = Timestamp.fromDate(new Date(2020, 0, 31))

// 	it("should return text based on condition.date if present", () => {
// 		const promo: PromoPeriod = {
// 			condition: { date: 15 },
// 			startDate: fakeStart,
// 			endDate: fakeEnd,
// 		}
// 		expect(makePromoPeriodText(promo)).toBe("Every 15th of the month")
// 	})

// 	it("should return text based on condition.day if present", () => {
// 		const promo: PromoPeriod = {
// 			condition: { day: "monday" },
// 			startDate: fakeStart,
// 			endDate: fakeEnd,
// 		}
// 		expect(makePromoPeriodText(promo)).toBe("Every Monday")
// 	})

// 	it("should return 'Always' if startDate or endDate is 'always'", () => {
// 		const promo1: PromoPeriod = {
// 			startDate: "always",
// 			endDate: fakeEnd,
// 		}
// 		const promo2: PromoPeriod = {
// 			startDate: fakeStart,
// 			endDate: "always",
// 		}
// 		expect(makePromoPeriodText(promo1)).toBe("Always")
// 		expect(makePromoPeriodText(promo2)).toBe("Always")
// 	})

// 	it("should return a range text based on startDate and endDate when no condition is provided", () => {
// 		const promo: PromoPeriod = {
// 			startDate: fakeStart,
// 			endDate: fakeEnd,
// 		}
// 		expect(makePromoPeriodText(promo)).toBe("Fake Start to Fake End")
// 	})
// })

// describe("isDealExpired", () => {
// 	// Use fake timers so that 'today' is predictable.
// 	beforeAll(() => {
// 		const fixedDate = new Date(2020, 0, 10)
// 		jest.useFakeTimers({ now: fixedDate.getTime() })
// 		jest.setSystemTime(fixedDate)
// 	})

// 	afterAll(() => {
// 		jest.useRealTimers()
// 	})

// 	// Helper fake date objects for promoPeriod.
// 	const promoStart = {
// 		toDate: () => new Date(2020, 0, 1), // Jan 1, 2020
// 	}

// 	it("should return false if deal has no promoPeriod", () => {
// 		// For a StoreDeal without promoPeriod, include required fields.
// 		const deal: StoreDeal = {
// 			...dummyStoreBase,
// 			discount: { discountValue: 20, discountType: "percentage" },
// 			condition: {
// 				id: "",
// 				clause: "",
// 				notes: undefined,
// 			},
// 			promoPeriod: {
// 				startDate: "always",
// 				endDate: "always",
// 				condition: undefined,
// 			},
// 		}
// 		expect(isDealExpired(deal)).toBe(false)
// 	})

// 	it("should return false if promoPeriod.startDate is 'always'", () => {
// 		const deal: BobaDeal = {
// 			drinks: [],
// 			discount: { discountValue: 10, discountType: "percentage" },
// 			dealType: "other",
// 			promoPeriod: {
// 				startDate: "always",
// 				endDate: Timestamp.fromDate(
// 					getNewDateWithNoTime(new Date(2020, 0, 5)),
// 				),
// 			},
// 			id: "",
// 			storeID: "",
// 			notes: "",
// 		}
// 		expect(isDealExpired(deal)).toBe(false)
// 	})

// 	it("should return false if promoPeriod.endDate is 'always'", () => {
// 		const deal: StoreDeal = {
// 			...dummyStoreBase,
// 			discount: { discountValue: 5, discountType: "flatoff" },
// 			promoPeriod: {
// 				startDate: Timestamp.fromDate(promoStart.toDate()),
// 				endDate: "always",
// 			},
// 			condition: {
// 				id: "",
// 				clause: "",
// 				notes: undefined,
// 			},
// 		}
// 		expect(isDealExpired(deal)).toBe(false)
// 	})

// 	it("should return true if promoPeriod.endDate is before today", () => {
// 		// Set promo end date to January 9, 2020 (past relative to Jan 10, 2020)
// 		const deal: BobaDeal = {
// 			drinks: [],
// 			discount: { discountValue: 20, discountType: "percentage" },
// 			dealType: "other",
// 			promoPeriod: {
// 				startDate: Timestamp.fromDate(promoStart.toDate()),
// 				endDate: Timestamp.fromDate(new Date(2020, 0, 9)),
// 			},
// 			id: "",
// 			storeID: "",
// 			notes: "",
// 		}
// 		expect(isDealExpired(deal)).toBe(true)
// 	})

// 	it("should return false if promoPeriod.endDate is today or in the future", () => {
// 		// End date is January 11, 2020 (future relative to Jan 10, 2020)
// 		const deal: StoreDeal = {
// 			...dummyStoreBase,
// 			discount: { discountValue: 20, discountType: "percentage" },
// 			promoPeriod: {
// 				startDate: Timestamp.fromDate(promoStart.toDate()),
// 				endDate: Timestamp.fromDate(new Date(2020, 0, 11)),
// 			},
// 			condition: {
// 				id: "",
// 				clause: "",
// 				notes: undefined,
// 			},
// 		}
// 		expect(isDealExpired(deal)).toBe(false)
// 	})
// })

describe("makeDrinkList", () => {
	// Helper drinks for testing
	const drinkA0: Drink = {
		name: "Coke",
		size: "regular",
		drinkIndex: 0,
		type: "other",
	}
	const drinkA1: Drink = {
		name: "Coke",
		size: "regular",
		drinkIndex: 1,
		type: "other",
	}
	const drinkB0: Drink = {
		name: "Pepsi",
		size: "large",
		drinkIndex: 0,
		type: "other",
	}
	const drinkB1: Drink = {
		name: "Sprite",
		size: "large",
		drinkIndex: 1,
		type: "other",
	}
	const drinkExtra: Drink = {
		name: "Fanta",
		size: "regular",
		drinkIndex: 2,
		type: "other",
	}

	it("should return an empty array when given an empty array", () => {
		expect(makeDrinkList([])).toEqual([])
	})

	it("should return the original array when all drinks belong to a single group", () => {
		const drinks: Drink[] = [drinkA0, { ...drinkA0, drinkIndex: 0 }]
		expect(makeDrinkList(drinks)).toEqual(drinks)
	})

	it("should return the first group if there are exactly 2 groups with equal drink arrays", () => {
		// Two groups: group 0 and group 1.
		// Both groups contain one drink with the same name.
		const group0: Drink = {
			name: "Coke",
			size: "regular",
			drinkIndex: 0,
			type: "other",
		}
		const group1: Drink = {
			name: "Coke",
			size: "any",
			drinkIndex: 1,
			type: "other",
		}
		const drinks: Drink[] = [group0, group1]
		// Since drinkArraysEqual compares the name property, these are considered equal.
		expect(makeDrinkList(drinks)).toEqual([group0])
	})

	it("should return the original array when there are exactly 2 groups but the arrays are not equal", () => {
		// Two groups: one with "Coke" and one with "Pepsi"
		const group0: Drink = {
			name: "Coke",
			size: "regular",
			drinkIndex: 0,
			type: "other",
		}
		const group1: Drink = {
			name: "Pepsi",
			size: "regular",
			drinkIndex: 1,
			type: "other",
		}
		const drinks: Drink[] = [group0, group1]
		expect(makeDrinkList(drinks)).toEqual(drinks)
	})

	it("should return the original array when there are more than 2 groups", () => {
		// Three groups: indices 0, 1, and 2.
		const drinks: Drink[] = [drinkA0, drinkA1, drinkExtra]
		expect(makeDrinkList(drinks)).toEqual(drinks)
	})
})
