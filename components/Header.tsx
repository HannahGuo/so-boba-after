import React from "react"
import { SafeAreaView, StyleSheet } from "react-native"
import DateChooser from "./DateChooser"
import { ThemedText } from "./ThemedText"
import { useIsMobileDevice } from "./helpers/deviceHelpers"

type HeaderPage = "home" | "add"

export default function Header({ page }: { page: HeaderPage }) {
	return (
		<SafeAreaView
			style={{
				...styles.headerContainer,
				flexDirection: useIsMobileDevice() ? "column" : "row",
			}}
		>
			<ThemedText
				type="title"
				style={!useIsMobileDevice() && { paddingLeft: 40 }}
			>
				...so, boba after?
			</ThemedText>
			<DateChooser />
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	headerContainer: {
		width: "100%",
		paddingTop: 20,
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
	titleContainer: {
		marginTop: 10,
		marginLeft: 20,
	},
	headerMobile: {
		position: "absolute",
		top: 0,
		height: 160,
		width: "100%",
		resizeMode: "contain",
	},
	rightContainer: {
		position: "absolute",
		top: 26,
		right: 40,
		display: "flex",
		flexDirection: "row",
		marginRight: -40,
		height: undefined,
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
