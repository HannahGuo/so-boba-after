import DealsList from "@/components/DealsList"
import Header from "@/components/Header"
import { getNewDateWithNoTime } from "@/components/helpers/dateHelpers"
import { isWeb } from "@/components/helpers/deviceHelpers"
import SortAndFilterBar from "@/components/SortAndFilterBar"
import { Colors } from "@/constants/Colors"
import { ShowDealsForDateContext } from "@/contexts/ShowDealsForDateContext"
import {
	NumberOfDrinks,
	SortAndFilterContext,
	SortType,
} from "@/contexts/SortAndFilterContext"
import { useEffect, useState } from "react"
import { ScrollView, StyleSheet } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"

export default function Home() {
	useEffect(() => {
		if (isWeb()) {
			document.title = "...so, boba after?"
		}
	}, [])

	const [showDealsForDate, setShowDealsForDate] = useState<Date | null>(
		getNewDateWithNoTime(),
	)

	const [sortType, setSortType] = useState<SortType>("storeName")
	const [numberOfDrinks, setNumberOfDrinks] = useState<NumberOfDrinks>("any")
	const [storeName, setStoreName] = useState<string>("")

	return (
		<GestureHandlerRootView>
			<ShowDealsForDateContext.Provider
				value={{ showDealsForDate, setShowDealsForDate }}
			>
				<SortAndFilterContext.Provider
					value={{
						sortType,
						setSortType,
						numberOfDrinks,
						setNumberOfDrinks,
						storeName,
						setStoreName,
					}}
				>
					<ScrollView
						style={styles.mainContainer}
						contentContainerStyle={{ marginBottom: 40 }}
					>
						<Header page="home" />
						<DealsList />
					</ScrollView>
					<SortAndFilterBar />
				</SortAndFilterContext.Provider>
			</ShowDealsForDateContext.Provider>
		</GestureHandlerRootView>
	)
}

const styles = StyleSheet.create({
	mainContainer: {
		height: "100%",
		backgroundColor: Colors.light.background,
		display: "flex",
		marginBottom: 20,
	},
})
