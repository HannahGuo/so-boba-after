// yes i just got this from chatgpt
export function getRelativeDateString(targetDate: Date): string {
	// 1. Get "today" with the time zeroed out
	const todayZero = getNewDateWithNoTime()

	// 2. Zero out the time in the target date
	const targetZero = getNewDateWithNoTime(targetDate)

	// 3. Calculate the difference in days (integer)
	const msInOneDay = 24 * 60 * 60 * 1000
	const diff: number =
		(targetZero.getTime() - todayZero.getTime()) / msInOneDay

	// 4. Return a human-readable string
	if (diff === 0) {
		return "today"
	} else if (diff === 1) {
		return "tomorrow"
	} else if (diff > 1) {
		return `in ${diff} days`
	} else {
		// For the past, you could add logic like "yesterday" or "N days ago":
		// e.g.: if (diff === -1) { return "yesterday" } else { return `${Math.abs(diff)} days ago` }
		// But for now:
		return "in the past"
	}
}

export function stringToDate(dateString: string, timezone?: string): Date {
	dateString += " " + (timezone ?? "EST")

	const [year, month, day] = dateString.split("-")
	// eslint-disable-next-line no-restricted-syntax
	return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
}

export function getNewDateWithNoTime(date?: Date): Date {
	if (!date) {
		// eslint-disable-next-line no-restricted-syntax
		date = new Date()
	}

	// eslint-disable-next-line no-restricted-syntax
	const newDate = new Date(date.getTime())
	newDate.setHours(0, 0, 0, 0)

	return newDate
}
