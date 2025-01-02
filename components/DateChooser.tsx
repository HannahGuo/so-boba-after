import { Colors } from "@/constants/Colors"
import { ShowDealsForDateContext } from "@/contexts/ShowDealsForDateContext"
import DateTimePicker from "@react-native-community/datetimepicker"
import Checkbox from "expo-checkbox"
import React, { useContext, useState } from "react"
import { Button, StyleSheet, View } from "react-native"
import { ThemedText } from "./ThemedText"
import { getRelativeDateString } from "./helpers/dateHelpers"
import { isWeb } from "./helpers/deviceHelpers"

export default function DateChooser() {
	const { showDealsForDate, setShowDealsForDate } = useContext(
		ShowDealsForDateContext,
	)

	const [showAllDeals, setShowAllDeals] = useState(false)

	const [showDatePickerMobile, setShowDatePickerMobile] = useState(false)

	return (
		<View style={styles.dateChooserContainer}>
			<View style={styles.checkboxRow}>
				<View>
					<ThemedText type="defaultBold">Show All Deals:</ThemedText>
				</View>
				<View>
					<Checkbox
						value={showAllDeals}
						onValueChange={(val) => {
							setShowAllDeals(val)
							if (val) {
								setShowDealsForDate(null)
							} else {
								setShowDealsForDate(new Date())
							}
						}}
						color={Colors.shared.bobaBrownLight}
					/>
				</View>
			</View>
			<View style={styles.dividerLine} />
			{showDealsForDate && (
				<>
					<ThemedText>Showing Deals for</ThemedText>
					{isWeb() ? (
						<input
							type="date"
							style={styles.dateInput}
							value={showDealsForDate
								.toLocaleDateString("en-CA")
								.substring(0, 10)}
							onChange={(e) => {
								if (e.target.value) {
									setShowDealsForDate(
										new Date(e.target.value + " EST"),
									)
								} else {
									setShowDealsForDate(new Date())
								}
							}}
							disabled={showAllDeals}
						/>
					) : (
						<>
							<ThemedText>
								{showDealsForDate
									.toLocaleDateString("en-CA")
									.substring(0, 10)}
							</ThemedText>
							<Button
								title="Change Date"
								color={Colors.shared.bobaBrownDark}
								onPress={() => setShowDatePickerMobile(true)}
							/>
							{showDatePickerMobile && (
								<DateTimePicker
									value={showDealsForDate}
									accentColor={Colors.shared.bobaBrown}
									textColor={Colors.shared.bobaBrown}
									mode="date"
									onChange={(_, date) => {
										if (date) {
											setShowDealsForDate(date)
										}
										setShowDatePickerMobile(false)
									}}
									disabled={showAllDeals}
								/>
							)}
						</>
					)}
					<ThemedText style={{ marginTop: 8, marginLeft: 10 }}>
						(which is {getRelativeDateString(showDealsForDate)})
					</ThemedText>
					<ThemedText style={{ marginTop: 8 }}>
						in <ThemedText type="defaultBold">Waterloo</ThemedText>
					</ThemedText>
				</>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	dateChooserContainer: {
		paddingLeft: 60,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		rowGap: 4,
		width: 320,
		top: -8,
	},
	underlineOnHover: {
		textDecorationLine: "underline",
		cursor: "pointer",
	},
	dateInput: {
		backgroundColor: "white",
		borderRadius: 10,
		padding: 6,
		paddingLeft: 12,
		fontFamily: "CourierPrime",
		fontSize: 18,
		borderColor: "white",
		boxShadow: "none",
		width: 150,
	},
	checkboxRow: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		width: 200,
	},
	dividerLine: {
		borderBottomColor: "white",
		borderBottomWidth: StyleSheet.hairlineWidth,
		marginBottom: 10,
		marginTop: 10,
		width: "100%",
	},
})
