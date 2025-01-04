// yes i just got this from chatgpt
export function getRelativeDateString(targetDate: Date): string {
	// 1. Get "today" with the time zeroed out
	const today = new Date()
	const todayZero = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate(),
	)

	// 2. Zero out the time in the target date
	const targetZero = new Date(
		targetDate.getFullYear(),
		targetDate.getMonth(),
		targetDate.getDate(),
	)

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

export function toDateIgnoreTimestamp(d: Date): Date {
	return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
