import { createContext } from "react"

export const ShowDealsForDateContext = createContext({
	showDealsForDate: new Date(),
	setShowDealsForDate: (date: Date) => {},
})
