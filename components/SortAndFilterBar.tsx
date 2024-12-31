import { Colors } from "@/constants/Colors"
import { Picker } from "@react-native-picker/picker"
import React from "react"
import { StyleSheet, View } from "react-native"
import { ThemedText } from "./ThemedText"

export default function SortAndFilterBar() {
	return (
		<View style={styles.container}>
			<View style={styles.pickerRow}>
				<ThemedText>Set Sort Order:</ThemedText>
				<View>
					<Picker
						style={styles.picker}
						// selectedValue={discountType}
						// onValueChange={(itemValue) =>
						// 	setDiscountType(itemValue)
						// }
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
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 14,
		backgroundColor: Colors.shared.bobaBrown,
		width: "100%",
		position: "sticky",
		bottom: 0,
	},
	pickerRow: {
		flexDirection: "row",
		alignItems: "baseline",
		justifyContent: "space-between",
		width: 480,
	},
	picker: {
		width: 300,
		fontFamily: "CourierPrime",
		fontSize: 18,
		borderRadius: 10,
		borderColor: "white",
		padding: 6,
	},
})
