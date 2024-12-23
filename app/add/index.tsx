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
	const [tabIndex, setTabIndex] = React.useState(0)

	return (
		<ScrollView style={styles.mainContainer}>
			<Header page="add" />
			<Tabs>
				<TabList style={styles.tabContainer}>
					<Tab
						style={{
							...styles.tabHeader,
							...(tabIndex === 0
								? {
										backgroundImage: `linear-gradient(to top, ${Colors.shared.bobaBrown}, 95%, ${Colors.shared.bobaBrownLight})`,
								  }
								: {
										backgroundImage: `linear-gradient(to top, ${Colors.shared.bobaBrownLight}, 95%, ${Colors.shared.bobaBrownLight})`,
								  }),
						}}
						onClick={() => setTabIndex(0)}
					>
						<ThemedText type="subtitle">Add Boba Deal</ThemedText>
					</Tab>
					<Tab
						style={{
							...styles.tabHeader,
							...(tabIndex === 1
								? {
										backgroundImage: `linear-gradient(to top, ${Colors.shared.bobaBrown}, 95%, ${Colors.shared.bobaBrownLight})`,
								  }
								: {
										backgroundImage: `linear-gradient(to top, ${Colors.shared.bobaBrownLight}, 95%, ${Colors.shared.bobaBrownLight})`,
								  }),
						}}
						onClick={() => setTabIndex(1)}
					>
						<ThemedText type="subtitle">Add Store Deal</ThemedText>
					</Tab>
				</TabList>

				<View style={styles.formContainer}>
					<TabPanel>
						<AddBobaDeal />
					</TabPanel>
					<TabPanel>
						<AddStoreDeal />
					</TabPanel>
				</View>
			</Tabs>
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
		padding: 40,
		width: "90%",
		margin: "auto",
		borderTopLeftRadius: 0,
		borderTopRightRadius: 20,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
		marginBottom: 40,
		backgroundColor: Colors.shared.bobaBrown,
	},
	tabContainer: {
		borderBottomColor: "white",
		marginBottom: 0,
		marginTop: 120,
		marginLeft: "5%",
	},
	tabHeader: {
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderWidth: 0,
	},
})
