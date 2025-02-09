/* eslint-disable no-restricted-syntax */
// dateUtils.test.ts

// generated these with chatgpt :)

import {
	getNewDateWithNoTime,
	getRelativeDateString,
	stringToDate,
} from "@/components/helpers/dateHelpers"

describe("getRelativeDateString", () => {
	// Set a fixed system time so that "today" is predictable.
	beforeAll(() => {
		// Use modern fake timers (available in Jest 26+)
		// Set the fixed date to January 1, 2020 at midnight local time.
		const fixedDate = new Date(2020, 0, 1)
		jest.useFakeTimers({ now: fixedDate.getTime() })
		jest.setSystemTime(fixedDate)
	})

	afterAll(() => {
		jest.useRealTimers()
	})

	it("returns 'today' when targetDate is today", () => {
		// Even if the target date has a non-zero time, it will be truncated.
		const target = new Date(2020, 0, 1, 15, 30) // Same day as fixedDate
		expect(getRelativeDateString(target)).toBe("today")
	})

	it("returns 'tomorrow' when targetDate is the next day", () => {
		// January 2, 2020 is one day ahead of January 1, 2020.
		const target = new Date(2020, 0, 2)
		expect(getRelativeDateString(target)).toBe("tomorrow")
	})

	it("returns 'in X days' when targetDate is more than one day ahead", () => {
		// For example, January 5, 2020 is 4 days after January 1, 2020.
		const target = new Date(2020, 0, 5)
		expect(getRelativeDateString(target)).toBe("in 4 days")
	})

	it("returns 'in the past' when targetDate is in the past", () => {
		// December 31, 2019 is before January 1, 2020.
		const target = new Date(2019, 11, 31)
		expect(getRelativeDateString(target)).toBe("in the past")
	})
})

describe("stringToDate", () => {
	it("parses a valid date string without timezone", () => {
		// The function appends a default " EST" (or provided timezone) and then splits by "-"
		const dateStr = "2020-01-01"
		const date = stringToDate(dateStr)
		expect(date.getFullYear()).toBe(2020)
		expect(date.getMonth()).toBe(0) // January (0-indexed)
		expect(date.getDate()).toBe(1)
	})

	it("parses a valid date string with provided timezone", () => {
		// Note: The timezone value is not actually used in the Date constructor.
		const dateStr = "2020-12-31"
		const date = stringToDate(dateStr, "GMT")
		expect(date.getFullYear()).toBe(2020)
		expect(date.getMonth()).toBe(11) // December (0-indexed)
		expect(date.getDate()).toBe(31)
	})
})

describe("getNewDateWithNoTime", () => {
	it("returns a new Date object with the time zeroed out when a date is provided", () => {
		// Create a date with non-zero time.
		const date = new Date(2020, 5, 15, 14, 35, 20, 500) // June 15, 2020, 14:35:20.500
		const result = getNewDateWithNoTime(date)
		expect(result.getFullYear()).toBe(2020)
		expect(result.getMonth()).toBe(5) // June (0-indexed)
		expect(result.getDate()).toBe(15)
		expect(result.getHours()).toBe(0)
		expect(result.getMinutes()).toBe(0)
		expect(result.getSeconds()).toBe(0)
		expect(result.getMilliseconds()).toBe(0)
	})

	it("returns today's date with time zeroed out when no argument is provided", () => {
		// Since we use fake timers, new Date() returns the fixed system time.
		const now = new Date()
		const result = getNewDateWithNoTime()
		expect(result.getFullYear()).toBe(now.getFullYear())
		expect(result.getMonth()).toBe(now.getMonth())
		expect(result.getDate()).toBe(now.getDate())
		expect(result.getHours()).toBe(0)
		expect(result.getMinutes()).toBe(0)
		expect(result.getSeconds()).toBe(0)
		expect(result.getMilliseconds()).toBe(0)
	})
})
