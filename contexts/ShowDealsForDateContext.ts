import React, { createContext } from "react"

export const ShowDealsForDateContext = createContext<{
	showDealsForDate: Date
	setShowDealsForDate: React.Dispatch<React.SetStateAction<Date>>
}>({
	showDealsForDate: new Date(),
	setShowDealsForDate: () => {},
})
