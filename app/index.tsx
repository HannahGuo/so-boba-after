import DealsList from "@/components/DealsList"
import Header from "@/components/Header"
import SortAndFilterBar from "@/components/SortAndFilterBar"
import { Colors } from "@/constants/Colors"
import { ShowDealsForDateContext } from "@/contexts/ShowDealsForDateContext"
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

	return (
		<ShowDealsForDateContext.Provider
			value={{ showDealsForDate, setShowDealsForDate }}
		>
			<ScrollView style={styles.mainContainer}>
				<Header page="home" />
				<DealsList />
				<SortAndFilterBar />
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
