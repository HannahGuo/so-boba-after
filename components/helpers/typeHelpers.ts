export function isDayCondition(
	condition: DayCondition | DateCondition,
): condition is DayCondition {
	return "day" in condition
}

export function isDateCondition(
	condition: DayCondition | DateCondition,
): condition is DateCondition {
	return "date" in condition
}
