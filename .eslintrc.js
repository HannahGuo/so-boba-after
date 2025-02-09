// https://docs.expo.dev/guides/using-eslint/
module.exports = {
	extends: "expo",
	ignorePatterns: ["/dist/*"],
	rules: {
		"no-restricted-syntax": [
			"error",
			{
				selector: "NewExpression[callee.name='Date']",
				message:
					"Using 'new Date()' is not allowed. Consider using a date library like 'date-fns' or 'luxon'.",
			},
			{
				selector: "MemberExpression[object.name='Timestamp']",
				message:
					"Using any method of 'Timestamp' is not allowed. Consider using a different approach.",
			},
		],
	},
}
