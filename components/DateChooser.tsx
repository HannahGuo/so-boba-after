import { Colors } from "@/constants/Colors"
import { ShowDealsForDateContext } from "@/contexts/ShowDealsForDateContext"
import DateTimePicker from "@react-native-community/datetimepicker"
import React, { useContext, useState } from "react"
import { Button, StyleSheet, View } from "react-native"
import { ThemedText } from "./ThemedText"
import {
	getNewDateWithNoTime,
	getRelativeDateString,
	stringToDate,
} from "./helpers/dateHelpers"
import { isWeb, useIsMobileDevice } from "./helpers/deviceHelpers"

export default function DateChooser() {
	const { showDealsForDate, setShowDealsForDate } = useContext(
		ShowDealsForDateContext,
	)

	const [showDatePickerMobile, setShowDatePickerMobile] = useState(false)

	const isMobileDevice = useIsMobileDevice()

	return (
		<View
			style={
				isMobileDevice
					? styles.mobileDateChooserContainer
					: styles.dateChooserContainer
			}
		>
			{showDealsForDate && (
				<>
					<ThemedText>Showing deals for</ThemedText>
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
										getNewDateWithNoTime(
											stringToDate(e.target.value),
										),
									)
								} else {
									setShowDealsForDate(getNewDateWithNoTime())
								}
							}}
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
								/>
							)}
						</>
					)}
					<ThemedText>
						({getRelativeDateString(showDealsForDate)})
					</ThemedText>
				</>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	dateChooserContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		rowGap: 4,
		marginRight: 30,
		backgroundColor: "white",
		borderRadius: 20,
		shadowColor: "black",
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 4,
		shadowOpacity: 0.25,
		paddingVertical: 4,
		paddingHorizontal: 20,
		height: 38,
	},
	mobileDateChooserContainer: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		width: "100%",
		rowGap: 4,
		backgroundColor: "white",
		borderRadius: 20,
		shadowColor: "black",
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 4,
		shadowOpacity: 0.25,
		paddingVertical: 10,
		paddingHorizontal: 20,
		marginHorizontal: 20,
		marginTop: 16,
	},
	underlineOnHover: {
		textDecorationLine: "underline",
		cursor: "pointer",
	},
	dateInput: {
		backgroundColor: "#FFD8B8",
		borderRadius: 10,
		borderWidth: 0,
		paddingLeft: 12,
		paddingRight: 8,
		marginLeft: 8,
		marginRight: 8,
		width: 140,
		fontSize: 18,
		borderColor: "white",
		boxShadow: "none",
		fontFamily: "Fredoka",
		textDecorationLine: "underline",
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
