import React, { createContext } from "react"

export const ShowDealsForDateContext = createContext<{
	showDealsForDate: Date | null
	setShowDealsForDate: React.Dispatch<React.SetStateAction<Date | null>>
}>({
	showDealsForDate: new Date(),
	setShowDealsForDate: () => {},
})
