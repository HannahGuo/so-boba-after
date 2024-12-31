import { Colors } from "@/constants/Colors"
import {
	NumberOfDrinks,
	SortAndFilterContext,
	SortType,
} from "@/contexts/SortAndFilterContext"
import { Picker } from "@react-native-picker/picker"
import React, { useContext } from "react"
import { StyleSheet, View } from "react-native"
import { ThemedText } from "./ThemedText"

export default function SortAndFilterBar() {
	const { sortType, setSortType, numberOfDrinks, setNumberOfDrinks } =
		useContext(SortAndFilterContext)

	return (
		<View style={styles.container}>
			<View style={styles.pickerRow}>
				<ThemedText style={styles.pickerTitle}>
					Set Sort Order:
				</ThemedText>
				<View>
					<Picker
						style={styles.picker}
						selectedValue={sortType}
						onValueChange={(itemValue: SortType) =>
							setSortType(itemValue)
						}
					>
						<Picker.Item
							label="Store Name (A-Z)"
							value="storeName"
						/>
						<Picker.Item label="Expiry Date" value="expiry" />
						<Picker.Item label="Price" value="price" />
					</Picker>
				</View>
			</View>
			<View style={styles.pickerRow}>
				<ThemedText style={styles.pickerTitle}>
					Filter by Drink Number:
				</ThemedText>
				<View>
					<Picker
						style={styles.picker}
						selectedValue={numberOfDrinks}
						onValueChange={(itemValue: NumberOfDrinks) =>
							setNumberOfDrinks(itemValue)
						}
					>
						<Picker.Item label="Any Number" value="any" />
						<Picker.Item label="One Drink" value="one" />
						<Picker.Item label="Two Drinks" value="two" />
					</Picker>
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 14,
		backgroundColor: Colors.shared.bobaBrown,
		width: "100%",
		position: "sticky",
		justifyContent: "space-evenly",
		alignContent: "center",
		display: "flex",
		flexDirection: "row",
		bottom: 0,
	},
	pickerRow: {
		flexDirection: "row",
		alignItems: "baseline",
		justifyContent: "space-between",
	},
	picker: {
		width: 300,
		fontFamily: "CourierPrime",
		fontSize: 18,
		borderRadius: 10,
		borderColor: "white",
		padding: 6,
	},
	pickerTitle: {
		marginRight: 20,
	},
})
