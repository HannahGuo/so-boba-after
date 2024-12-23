import { Link } from "expo-router"
import { useState } from "react"
import { ImageBackground, Pressable, StyleSheet, View } from "react-native"
import { ThemedText } from "./ThemedText"

type HeaderPage = "home" | "add"

export default function Header({ page }: { page: HeaderPage }) {
	const [hover, setHover] = useState(false)

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

				<View style={{ marginLeft: 20 }}>
					<ThemedText>Showing deals for...</ThemedText>
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
		top: -20,
		left: "68%",
	},
	rightContainer: {
		position: "absolute",
		top: 26,
		left: "69.8%",
		display: "flex",
		flexDirection: "row",
	},
	underlineOnHover: {
		textDecorationLine: "underline",
		cursor: "pointer",
	},
})
