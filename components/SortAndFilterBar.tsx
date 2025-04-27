import { Colors } from "@/constants/Colors"
import { Store } from "@/constants/types/Deals"
import {
	NumberOfDrinks,
	SortAndFilterContext,
	SortType,
} from "@/contexts/SortAndFilterContext"
import { db } from "@/firebase/app/firebaseConfig"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { Picker } from "@react-native-picker/picker"
import { collection, getDocs } from "firebase/firestore"
import React, { useContext, useEffect } from "react"
import { ImageBackground, StyleSheet, View } from "react-native"
import { ThemedText } from "./ThemedText"
import { isWeb, useIsDesktop, useIsMobileDevice } from "./helpers/deviceHelpers"

export default function SortAndFilterBar() {
	const {
		sortType,
		setSortType,
		numberOfDrinks,
		setNumberOfDrinks,
		storeName,
		setStoreName,
	} = useContext(SortAndFilterContext)

	const isMobileDeviceCheck = useIsMobileDevice()
	const isDesktopCheck = useIsDesktop()

	// TODO: i know this is bad.
	const [storesList, setStoresList] = React.useState<Store[]>([])
	useEffect(() => {
		const fetchData = async () => {
			const querySnapshot = await getDocs(collection(db, "stores"))
			const storesList = querySnapshot.docs.map((doc) => {
				const data = doc.data() as Store
				return { ...data, id: doc.id }
			})

			storesList.sort((a, b) => a.name.localeCompare(b.name))
			setStoresList(storesList)
		}
		fetchData()
	}, [])

	return (
		<BottomSheet
			snapPoints={!isMobileDeviceCheck ? [] : [20]}
			enableDynamicSizing={true}
			animateOnMount={false}
			enableOverDrag={false}
			handleIndicatorStyle={{
				backgroundColor: "white",
			}}
			backgroundStyle={{
				backgroundColor: isMobileDeviceCheck
					? Colors.shared.bobaBrown
					: "rgba(0,0,0,0)",
			}}
			handleComponent={isDesktopCheck ? null : undefined}
		>
			<ImageBackground
				source={require("../assets/images/footer.png")}
				style={{
					width: "100%",
					height: "auto",
					position: "absolute",
					right: 0,
					top: 0,
					backgroundColor: "rgba(0,0,0,0) !important",
				}}
				resizeMode="stretch"
			>
				<BottomSheetView
					style={
						!isMobileDeviceCheck
							? styles.container
							: styles.mobileContainer
					}
				>
					<View style={!isMobileDeviceCheck && styles.pickerRow}>
						<ThemedText style={styles.pickerTitle}>
							Set Sort Order:
						</ThemedText>
						<View>
							<Picker
								style={{
									...styles.picker,
									...(isWeb()
										? { color: "black" }
										: { color: "white" }),
								}}
								selectedValue={sortType}
								onValueChange={(itemValue: SortType) =>
									setSortType(itemValue)
								}
								dropdownIconColor="white"
								prompt="Select Sort Method"
							>
								<Picker.Item
									label="Store Name (A-Z)"
									value="storeName"
								/>
								<Picker.Item
									label="Expiry Date"
									value="expiry"
								/>
								<Picker.Item label="Price" value="price" />
							</Picker>
						</View>
					</View>
					<View style={!isMobileDeviceCheck && styles.pickerRow}>
						<ThemedText style={styles.pickerTitle}>
							Filter by Drink Number:
						</ThemedText>
						<View>
							<Picker
								style={{
									...styles.picker,
									...(isWeb()
										? { color: "black" }
										: { color: "white" }),
								}}
								selectedValue={numberOfDrinks}
								onValueChange={(itemValue: NumberOfDrinks) =>
									setNumberOfDrinks(itemValue)
								}
								dropdownIconColor="white"
								prompt="Filter by Drink Number"
							>
								<Picker.Item label="Any" value="any" />
								<Picker.Item label="1 Drink" value="one" />
								<Picker.Item label="2 Drinks" value="two" />
							</Picker>
						</View>
					</View>
					<View style={!isMobileDeviceCheck && styles.pickerRow}>
						<ThemedText style={styles.pickerTitle}>
							Filter by Store:
						</ThemedText>
						<Picker
							style={styles.picker}
							selectedValue={storeName}
							onValueChange={(itemValue) =>
								setStoreName(itemValue)
							}
							placeholder="Select a store"
						>
							{["any", ...storesList].map((store) => {
								if (typeof store === "string") {
									return (
										<Picker.Item
											label={store}
											value={store}
											key={store}
										/>
									)
								}
								return (
									<Picker.Item
										label={store.name}
										value={store.name}
										key={store.name}
									/>
								)
							})}
						</Picker>
					</View>
					<View style={{ ...styles.pickerRow, marginBottom: 8 }}>
						<ThemedText>
							Made with 🧋 by{" "}
							<a
								href="https://github.com/HannahGuo"
								rel="noreferrer"
							>
								Hannah
							</a>
						</ThemedText>
					</View>
				</BottomSheetView>
			</ImageBackground>
		</BottomSheet>
	)
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		justifyContent: "space-evenly",
		alignContent: "center",
		display: "flex",
		flexDirection: "row",
		padding: 8,
		height: 90,
		alignItems: "flex-end",
	},
	mobileContainer: {
		backgroundColor: Colors.shared.bobaBrown,
		width: "100%",
		justifyContent: "space-evenly",
		alignContent: "center",
		display: "flex",
		flexDirection: "column",
		rowGap: 10,
		padding: 14,
	},
	pickerRow: {
		flexDirection: "row",
		alignItems: "baseline",
		justifyContent: "space-between",
	},
	picker: {
		fontFamily: "Fredoka",
		fontSize: 18,
		borderRadius: 10,
		borderColor: "white",
		padding: 6,
		paddingLeft: 10,
		paddingRight: 10,
		color: "black",
	},
	pickerTitle: {
		marginRight: 20,
	},
	dividerLine: {
		borderBottomColor: "white",
		borderBottomWidth: StyleSheet.hairlineWidth,
		marginBottom: 10,
		marginTop: 10,
		width: "100%",
	},
})
