import { getNewDateWithNoTime } from "@/components/helpers/dateHelpers"
import React, { createContext } from "react"

export const ShowDealsForDateContext = createContext<{
	showDealsForDate: Date | null
	setShowDealsForDate: React.Dispatch<React.SetStateAction<Date | null>>
}>({
	showDealsForDate: getNewDateWithNoTime(),
	setShowDealsForDate: () => {},
})
