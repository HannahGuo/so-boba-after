import Header from "@/components/Header"
import { ThemedText } from "@/components/ThemedText"
import { Colors } from "@/constants/Colors"
import React from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import "react-tabs/style/react-tabs.css"
import AddBobaDeal from "./AddBobaDeal"
import AddStoreDeal from "./AddStoreDeal"

export default function Add() {
	return (
		<ScrollView style={styles.mainContainer}>
			<Header page="add" />
			<View style={styles.formContainer}>
				<Tabs>
					<TabList style={{ borderBottom: "1px solid white" }}>
						<Tab
							style={{ backgroundColor: Colors.shared.bobaBrown }}
						>
							<ThemedText type="subtitle">
								Add Boba Deal
							</ThemedText>
						</Tab>
						<Tab
							style={{ backgroundColor: Colors.shared.bobaBrown }}
						>
							<ThemedText type="subtitle">
								Add Store Deal
							</ThemedText>
						</Tab>
					</TabList>

					<TabPanel>
						<AddBobaDeal />
					</TabPanel>
					<TabPanel>
						<AddStoreDeal />
					</TabPanel>
				</Tabs>
			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	mainContainer: {
		backgroundColor: Colors.light.background,
		display: "flex",
	},
	formContainer: {
		display: "flex",
		backgroundImage: `linear-gradient(to top, ${Colors.shared.bobaBrown}, 95%, ${Colors.shared.bobaBrownLight})`,
		padding: 40,
		width: "90%",
		margin: "auto",
		marginTop: 120,
		borderRadius: 20,
		marginBottom: 40,
	},
})
