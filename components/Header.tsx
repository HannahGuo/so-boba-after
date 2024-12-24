import { ShowDealsForDateContext } from "@/contexts/ShowDealsForDateContext"
import DateTimePicker from "@react-native-community/datetimepicker"
import Checkbox from "expo-checkbox"
import { Link } from "expo-router"
import React, { useContext, useState } from "react"
import {
	ImageBackground,
	Platform,
	Pressable,
	StyleSheet,
	View,
} from "react-native"
import { ThemedText } from "./ThemedText"
import { getRelativeDateString } from "./helpers/dateHelpers"

type HeaderPage = "home" | "add"

export default function Header({ page }: { page: HeaderPage }) {
	const [hover, setHover] = useState(false)

	const { showDealsForDate, setShowDealsForDate } = useContext(
		ShowDealsForDateContext,
	)

	const [showAllDeals, setShowAllDeals] = useState(false)

	return (
		<View style={styles.headerContainer}>
			<ImageBackground
				source={require("../assets/images/bobaHeaderLeft.svg")}
				style={styles.headerImageLeft}
			/>
			<View style={styles.titleContainer}>
				<ThemedText type="title">...so boba after?</ThemedText>
			</View>
			<ImageBackground
				source={require("../assets/images/bobaHeaderRight.svg")}
				style={styles.headerImageRight}
			/>

			<View style={styles.rightContainer}>
				<Pressable
					onHoverIn={() => setHover(true)}
					onHoverOut={() => setHover(false)}
				>
					{page === "home" && (
						<Link href="/add">
							<ThemedText
								style={hover && styles.underlineOnHover}
							>
								Add a deal [+]
							</ThemedText>
						</Link>
					)}
					{page === "add" && (
						<Link href="/">
							<ThemedText
								style={hover && styles.underlineOnHover}
							>
								Back to home
							</ThemedText>
						</Link>
					)}
				</Pressable>
				<View
					style={{
						paddingLeft: 60,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						rowGap: 4,
						width: 320,
						top: -8,
					}}
				>
					<View style={styles.checkboxRow}>
						<ThemedText type="defaultBold">
							Show All Deals:
						</ThemedText>
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
						/>
					</View>
					<View style={styles.dividerLine} />
					{showDealsForDate && (
						<>
							<ThemedText>Showing Deals for</ThemedText>
							{Platform.OS === "web" ? (
								<input
									type="date"
									style={styles.dateInput}
									value={showDealsForDate
										.toISOString()
										.substr(0, 10)}
									onChange={(e) =>
										setShowDealsForDate(
											new Date(e.target.value + " EST"),
										)
									}
									disabled={showAllDeals}
								/>
							) : (
								<DateTimePicker
									value={showDealsForDate}
									mode="date"
									onChange={(_) => {}}
									disabled={showAllDeals}
								/>
							)}
							<ThemedText
								style={{ marginTop: 8, marginLeft: 10 }}
							>
								(which is{" "}
								{getRelativeDateString(showDealsForDate)})
							</ThemedText>
							<ThemedText style={{ marginTop: 8 }}>
								in{" "}
								<ThemedText type="defaultBold">
									Waterloo
								</ThemedText>
							</ThemedText>
						</>
					)}
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	headerContainer: {
		width: "100%",
	},
	titleContainer: {
		marginTop: 10,
		marginLeft: 20,
	},
	headerImageLeft: {
		position: "absolute",
		top: -40,
		left: -20,
	},
	headerImageRight: {
		position: "absolute",
		top: 0,
		left: "68%",
	},
	rightContainer: {
		position: "absolute",
		top: 26,
		right: 40,
		display: "flex",
		flexDirection: "row",
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
