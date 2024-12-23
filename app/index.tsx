import DealsList from "@/components/DealsList"
import Header from "@/components/Header"
import SortAndFilterBar from "@/components/SortAndFilterBar"
import { Colors } from "@/constants/Colors"
import { useEffect } from "react"
import { ScrollView, StyleSheet } from "react-native"

export default function Home() {
	useEffect(() => {
		document.title = "...so, boba after?"
	}, [])

	return (
		<ScrollView style={styles.mainContainer}>
			<Header page="home" />
			<DealsList />
			<SortAndFilterBar />
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	mainContainer: {
		height: "100%",
		backgroundColor: Colors.light.background,
		display: "flex",
	},
})
