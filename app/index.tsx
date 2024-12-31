import DealsList from "@/components/DealsList"
import Header from "@/components/Header"
import SortAndFilterBar from "@/components/SortAndFilterBar"
import { Colors } from "@/constants/Colors"
import { ShowDealsForDateContext } from "@/contexts/ShowDealsForDateContext"
import {
	NumberOfDrinks,
	SortAndFilterContext,
	SortType,
} from "@/contexts/SortAndFilterContext"
import { useEffect, useState } from "react"
import { Platform, ScrollView, StyleSheet } from "react-native"

export default function Home() {
	useEffect(() => {
		if (Platform.OS === "web") {
			document.title = "...so, boba after?"
		}
	}, [])

	const [showDealsForDate, setShowDealsForDate] = useState<Date | null>(
		new Date(),
	)

	const [sortType, setSortType] = useState<SortType>("storeName")
	const [numberOfDrinks, setNumberOfDrinks] = useState<NumberOfDrinks>("any")

	return (
		<ShowDealsForDateContext.Provider
			value={{ showDealsForDate, setShowDealsForDate }}
		>
			<ScrollView style={styles.mainContainer}>
				<Header page="home" />
				<SortAndFilterContext.Provider
					value={{
						sortType,
						setSortType,
						numberOfDrinks,
						setNumberOfDrinks,
					}}
				>
					<DealsList />
					<SortAndFilterBar />
				</SortAndFilterContext.Provider>
			</ScrollView>
		</ShowDealsForDateContext.Provider>
	)
}

const styles = StyleSheet.create({
	mainContainer: {
		height: "100%",
		backgroundColor: Colors.light.background,
		display: "flex",
	},
})
