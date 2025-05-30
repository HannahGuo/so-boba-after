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
import { Dimensions, ScrollView, StyleSheet, View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"

const { width: screenWidth } = Dimensions.get("window")

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
		<GestureHandlerRootView style={{ flex: 1 }}>
			<View style={styles.pageWrapper}>
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
						<ScrollView style={styles.mainContainer}>
							<View style={styles.scrollContent}>
								<Header page="home" />
								<DealsList />
							</View>
						</ScrollView>

						<SortAndFilterBar />
					</SortAndFilterContext.Provider>
				</ShowDealsForDateContext.Provider>
			</View>
		</GestureHandlerRootView>
	)
}

const styles = StyleSheet.create({
	pageWrapper: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
	mainContainer: {
		flex: 1,
	},
	scrollContent: {
		zIndex: 2,
	},
	backgroundImage: {
		position: "absolute",
		bottom: 0,
		width: "100%",
		height: 982,
		zIndex: -1,
	},
})
