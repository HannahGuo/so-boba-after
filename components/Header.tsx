import { Link } from "expo-router"
import React, { useState } from "react"
import {
	ImageBackground,
	Pressable,
	SafeAreaView,
	StyleSheet,
	View,
} from "react-native"
import DateChooser from "./DateChooser"
import { ThemedText } from "./ThemedText"
import { isDesktop, isMobileDevice, isWeb } from "./helpers/deviceHelpers"

type HeaderPage = "home" | "add"

export default function Header({ page }: { page: HeaderPage }) {
	const [hover, setHover] = useState(false)

	const isMobileCheck = isMobileDevice()
	const isWebCheck = isWeb()
	const isDesktopCheck = isDesktop()

	return (
		<SafeAreaView style={styles.headerContainer}>
			<ImageBackground
				source={require("../assets/images/bobaHeaderLeft.png")}
				style={
					isWebCheck ? styles.headerImageLeft : styles.headerMobile
				}
			/>
			<View style={styles.titleContainer}>
				<ThemedText
					type="title"
					style={
						isMobileCheck && {
							fontSize: 48,
						}
					}
				>
					...so, boba after?
				</ThemedText>
			</View>
			{isDesktopCheck && (
				<ImageBackground
					source={require("../assets/images/bobaHeaderRight.png")}
					style={styles.headerImageRight}
				/>
			)}

			<View style={styles.rightContainer}>
				{!isMobileCheck && (
					<>
						<Pressable
							style={{ marginRight: 60 }}
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
						{page === "home" && <DateChooser />}
					</>
				)}
			</View>
		</SafeAreaView>
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
