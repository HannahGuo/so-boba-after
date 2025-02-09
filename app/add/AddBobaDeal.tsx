import {
	getNewDateWithNoTime,
	stringToDate,
} from "@/components/helpers/dateHelpers"
import { isWeb } from "@/components/helpers/deviceHelpers"
import { ThemedText } from "@/components/ThemedText"
import { Colors } from "@/constants/Colors"
import {
	BobaDeal,
	BobaDealType,
	DateCondition,
	DayCondition,
	DiscountType,
	Drink,
	DrinkSize,
	DrinkType,
	Store,
	Weekday,
} from "@/constants/types/Deals"
import { UserAuthContext } from "@/contexts/UserAuthContext"
import { db, provider } from "@/firebase/app/firebaseConfig"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Picker } from "@react-native-picker/picker"
import Checkbox from "expo-checkbox"
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import { Timestamp, doc, setDoc } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { Button, StyleSheet, TextInput, View } from "react-native"

function makeDrinkHolderPlaceholder(
	drinkNumber: number,
	dealType: BobaDealType | undefined,
): string {
	if (dealType === "single" && drinkNumber > 1) {
		return "Only one drink for single deals"
	}

	if (dealType === "bogo" && drinkNumber === 3) {
		return "Only two drinks for BOGO"
	}

	return `Drink Name`
}

function makeDiscountInfoString(dealType: BobaDealType | undefined): string {
	switch (dealType) {
		case "single":
			return "For Single deal type, this is the discount on any one drink."
		case "bogo":
			return "For BOGO deal type, this is the discount on second drink (first is assumed to be full-price)"
		case "buyXforY":
			return "For Buy X for Y deal type, this is the discount on all drinks."
		default:
			return "Discount on total"
	}
}

function determineDrinkTypeFromName(drinkName: string): DrinkType {
	if (drinkName.toLowerCase().includes("milk")) {
		return "milktea"
	} else if (drinkName.toLowerCase().includes("fruit tea")) {
		return "fruittea"
	} else if (drinkName.toLowerCase().includes("slush")) {
		return "slush"
	} else {
		return "other"
	}
}
export default function AddBobaDeal({ storesList }: { storesList: Store[] }) {
	const [storeName, setStoreName] = useState<string | undefined>(undefined)
	const [dealType, setDealType] = useState<BobaDealType>("single")

	const [drinkNameOne, setDrinkNameOne] = useState<string>()
	const [drinkSizeOne, setDrinkSizeOne] = useState<DrinkSize>("any")

	const [drinkNameTwo, setDrinkNameTwo] = useState<string>()
	const [drinkSizeTwo, setDrinkSizeTwo] = useState<DrinkSize>("any")

	// i actually dont know if we need this third field...
	const [drinkNameThree, setDrinkNameThree] = useState<string>()
	const [drinkSizeThree, setDrinkSizeThree] = useState<DrinkSize>("any")

	const allowDrinkTwo = dealType !== "single"
	const allowDrinkThree = dealType !== "single" && dealType !== "bogo"

	const [startDate, setStartDate] = useState<Date>(getNewDateWithNoTime())
	const [endDate, setEndDate] = useState<Date>(getNewDateWithNoTime())
	const [dayCondition, setDayCondition] = useState<Weekday | null>(null)
	const [dateCondition, setDateCondition] = useState<number>(0)

	const [isDiscountAlwaysActive, setDiscountAlwaysActive] = useState(true)

	const [notes, setNotes] = useState<string>()

	const [discountType, setDiscountType] = useState<DiscountType>("total")
	const [discountValue, setDiscountValue] = useState<number>(0)

	const { user, setUser } = React.useContext(UserAuthContext)

	const auth = getAuth()

	function signInWithGoogle() {
		signInWithPopup(auth, provider).then((result) => {
			const credential = GoogleAuthProvider.credentialFromResult(result)
			const token = credential ? credential.accessToken : null
			const user = result.user
			if (user && token) {
				setUser(user)
			}
		})
	}

	function signOut() {
		auth.signOut().then(() => {
			setUser(null)
		})
	}

	function validateForm(): boolean {
		if (
			!storeName ||
			!dealType ||
			!drinkNameOne ||
			!drinkSizeOne ||
			!discountType
		) {
			alert("Please fill out all required fields")
			return false
		}

		return true
	}

	function resetForm() {
		setStoreName("")
		setDealType("single")
		setDrinkNameOne("")
		setDrinkSizeOne("any")
		setDrinkNameTwo("")
		setDrinkSizeTwo("any")
		setDrinkNameThree("")
		setDrinkSizeThree("any")
		setStartDate(getNewDateWithNoTime())
		setEndDate(getNewDateWithNoTime())
		setDayCondition(null)
		setDateCondition(0)
		setDiscountType("total")
		setDiscountValue(0)
		setNotes("")
	}

	async function submitDeal() {
		if (!validateForm()) {
			return
		}

		const dealID =
			Math.random().toString(36).substring(2, 15) +
			Math.random().toString(36).substring(2, 15)

		const allDrinks = [
			{ names: drinkNameOne, size: drinkSizeOne },
			{ names: drinkNameTwo, size: drinkSizeTwo },
			{ names: drinkNameThree, size: drinkSizeThree },
		]

		const drinksList: Drink[] = allDrinks.flatMap((item, index) => {
			if (!item.names) return []

			return item.names.split(",").map((name) => ({
				name: name.trim(),
				type: determineDrinkTypeFromName(name.trim()),
				size: item.size,
				drinkIndex: index,
			}))
		})

		let chosenCondition: DayCondition | DateCondition | undefined =
			undefined

		if (dayCondition) {
			chosenCondition = { day: dayCondition }
		} else if (dateCondition) {
			chosenCondition = { date: Number(dateCondition) }
		}

		const constructedDeal: BobaDeal = {
			id: dealID,
			storeID:
				storesList.find((store) => store.name === storeName)?.id ?? "",
			dealType: dealType,
			drinks: drinksList,
			promoPeriod: {
				startDate: isDiscountAlwaysActive
					? "always"
					: // eslint-disable-next-line no-restricted-syntax
					  Timestamp.fromDate(startDate),
				endDate: isDiscountAlwaysActive
					? "always"
					: // eslint-disable-next-line no-restricted-syntax
					  Timestamp.fromDate(endDate),
				...(chosenCondition !== undefined && {
					condition: chosenCondition,
				}),
			},
			discount: {
				discountType: discountType,
				discountValue: discountValue,
			},
			notes: notes ?? "",
		}

		await setDoc(doc(db, "boba-deals", dealID), constructedDeal)

		resetForm()
	}

	const storeAddress = storesList.find(
		(store) => storeName === store.name,
	)?.address

	useEffect(() => {
		if (storesList.length > 0) {
			setStoreName(storesList[0].name)
		}
	}, [storesList])

	return (
		<>
			<View style={styles.inputContainer}>
				<ThemedText type="subtitle">Store Name:</ThemedText>
				<Picker
					style={styles.picker}
					selectedValue={storeName}
					onValueChange={(itemValue) => setStoreName(itemValue)}
					placeholder="Select a store"
				>
					{storesList.map((store) => (
						<Picker.Item
							label={store.name}
							value={store.name}
							key={store.name}
						/>
					))}
				</Picker>
				<ThemedText>({storeAddress})</ThemedText>
			</View>
			<View style={styles.inputContainer}>
				<ThemedText type="subtitle">Deal Type:</ThemedText>
				<Picker
					style={styles.picker}
					selectedValue={dealType}
					onValueChange={(itemValue) => setDealType(itemValue)}
				>
					<Picker.Item label="Single" value="single" />
					<Picker.Item label="BOGO" value="bogo" />
					<Picker.Item label="Buy X for Y" value="buyXforY" />
					<Picker.Item label="Other" value="other" />
				</Picker>
			</View>
			<View style={styles.textInputContainer}>
				<ThemedText type="subtitle">Drink Name(s):</ThemedText>
				<ThemedText style={styles.inputNote}>
					If the deal is for “one of XYZ” input all drinks in one box
					with each drink comma-seperated.
				</ThemedText>
				<View style={styles.textInputRow}>
					<View style={styles.inputCol}>
						<TextInput
							style={{ ...styles.textInput, height: 46 }}
							placeholder={makeDrinkHolderPlaceholder(
								1,
								dealType,
							)}
							value={drinkNameOne}
							onChangeText={setDrinkNameOne}
							placeholderTextColor={"lightgray"}
						/>
						<Picker
							style={styles.thinPicker}
							selectedValue={drinkSizeOne}
							onValueChange={(itemValue) =>
								setDrinkSizeOne(itemValue)
							}
						>
							<Picker.Item label="Any Size" value="any" />
							<Picker.Item label="Regular" value="regular" />
							<Picker.Item label="Large" value="large" />
						</Picker>
					</View>
					<View style={styles.inputCol}>
						<TextInput
							style={{
								...(!allowDrinkTwo
									? styles.disabledTextInput
									: styles.textInput),
								height: 46,
							}}
							placeholder={makeDrinkHolderPlaceholder(
								2,
								dealType,
							)}
							value={drinkNameTwo}
							onChangeText={setDrinkNameTwo}
							editable={allowDrinkTwo}
							placeholderTextColor={
								!allowDrinkTwo ? "white" : "lightgray"
							}
						/>
						<Picker
							enabled={allowDrinkTwo}
							style={styles.thinPicker}
							selectedValue={drinkSizeTwo}
							onValueChange={(itemValue) =>
								setDrinkSizeTwo(itemValue)
							}
						>
							<Picker.Item label="Any Size" value="any" />
							<Picker.Item label="Regular" value="regular" />
							<Picker.Item label="Large" value="large" />
						</Picker>
					</View>
					<View style={styles.inputCol}>
						<TextInput
							style={{
								...(!allowDrinkThree
									? styles.disabledTextInput
									: styles.textInput),
								height: 46,
							}}
							placeholder={makeDrinkHolderPlaceholder(
								3,
								dealType,
							)}
							value={drinkNameThree}
							onChangeText={setDrinkNameThree}
							editable={allowDrinkThree}
							placeholderTextColor={
								!allowDrinkThree ? "white" : "lightgray"
							}
						/>
						<Picker
							enabled={allowDrinkThree}
							style={styles.thinPicker}
							selectedValue={drinkSizeThree}
							onValueChange={(itemValue) =>
								setDrinkSizeThree(itemValue)
							}
						>
							<Picker.Item label="Any Size" value="any" />
							<Picker.Item label="Regular" value="regular" />
							<Picker.Item label="Large" value="large" />
						</Picker>
					</View>
				</View>
			</View>
			<View style={{ marginTop: 12 }}>
				<ThemedText type="subtitle">Drink Promotion:</ThemedText>
				<ThemedText style={styles.inputNote}>
					{makeDiscountInfoString(dealType)}
				</ThemedText>
				<View style={styles.inputRow}>
					{isWeb() ? (
						<input
							type="number"
							value={discountValue}
							onChange={(e) => {
								const value = parseFloat(e.target.value)
								setDiscountValue(value)
							}}
							style={{ ...styles.picker, height: 34 }}
						/>
					) : (
						<TextInput
							style={styles.textInput}
							value={discountValue.toString()}
							onChangeText={(text) => {
								const value = parseFloat(text)
								setDiscountValue(value)
							}}
							keyboardType="decimal-pad"
							placeholderTextColor="lightgray"
						/>
					)}
					<Picker
						style={styles.picker}
						selectedValue={discountType}
						onValueChange={(itemValue) =>
							setDiscountType(itemValue)
						}
					>
						<Picker.Item label="Total" value="total" />
						<Picker.Item label="Percentage" value="percentage" />
						<Picker.Item label="Flat Off" value="flatoff" />
					</Picker>
				</View>
			</View>
			<View style={styles.dateInputContainer}>
				<ThemedText type="subtitle">Deal Dates:</ThemedText>
				<View style={styles.dateInputRow}>
					<View style={styles.checkboxRow}>
						<ThemedText type="subsubtitle">
							Always Active:
						</ThemedText>
						<Checkbox
							value={isDiscountAlwaysActive}
							onValueChange={setDiscountAlwaysActive}
							color={Colors.shared.bobaBrownLight}
						/>
					</View>

					<ThemedText type="subsubtitle">Start Date:</ThemedText>
					<View>
						{isWeb() ? (
							<input
								type="date"
								style={styles.dateInput}
								value={startDate
									.toLocaleDateString("en-CA")
									.substring(0, 10)}
								onChange={(e) =>
									setStartDate(
										getNewDateWithNoTime(
											stringToDate(e.target.value),
										),
									)
								}
								placeholder="Start Date"
								disabled={isDiscountAlwaysActive}
							/>
						) : (
							<DateTimePicker
								value={startDate}
								mode="date"
								onChange={(_, selectedDate) =>
									selectedDate && setStartDate(selectedDate)
								}
								disabled={isDiscountAlwaysActive}
							/>
						)}
					</View>
					<ThemedText type="subsubtitle">End Date:</ThemedText>
					<View>
						{isWeb() ? (
							<input
								style={styles.dateInput}
								type="date"
								placeholder="End Date"
								value={endDate
									.toLocaleDateString("en-CA")
									.substring(0, 10)}
								onChange={(e) =>
									setEndDate(
										getNewDateWithNoTime(
											stringToDate(e.target.value),
										),
									)
								}
								disabled={isDiscountAlwaysActive}
							/>
						) : (
							<DateTimePicker
								value={endDate}
								mode="date"
								onChange={(_, selectedDate) =>
									selectedDate && setEndDate(selectedDate)
								}
								disabled={isDiscountAlwaysActive}
							/>
						)}
					</View>
				</View>
				<View
					style={{
						...styles.dateInputRow,
						marginTop: 30,
						display: "flex",
					}}
				>
					<ThemedText type="subsubtitle">
						Condition (optional):
					</ThemedText>
					<ThemedText type="defaultBold">Day:</ThemedText>
					<Picker
						style={styles.thinPicker}
						selectedValue={dayCondition}
						onValueChange={(itemValue) =>
							setDayCondition(itemValue)
						}
					>
						<Picker.Item label="None" value={null} />
						<Picker.Item label="Every Monday" value="monday" />
						<Picker.Item label="Every Tuesday" value="tuesday" />
						<Picker.Item
							label="Every Wednesday"
							value="wednesday"
						/>
						<Picker.Item label="Every Thursday" value="thursday" />
						<Picker.Item label="Every Friday" value="friday" />
						<Picker.Item label="Every Saturday" value="saturday" />
						<Picker.Item label="Every Sunday" value="sunday" />
					</Picker>
					<ThemedText>or</ThemedText>
					<ThemedText type="defaultBold">Date:</ThemedText>
					<Picker
						style={styles.thinPicker}
						selectedValue={dateCondition}
						onValueChange={(itemValue) =>
							setDateCondition(itemValue)
						}
					>
						<Picker.Item label="None" value={0} />
						{Array.from({ length: 31 }, (_, i) => (
							<Picker.Item
								label={(i + 1).toString()}
								value={(i + 1) as number}
								key={`date-condition-${i + 1}`}
							/>
						))}
					</Picker>
				</View>
			</View>
			<View style={styles.notesInputContainer}>
				<ThemedText type="subtitle">Notes:</ThemedText>
				<ThemedText style={styles.inputNote}>
					Limits, restrictions, etc.
				</ThemedText>
				<TextInput
					style={styles.notesInput}
					multiline={true}
					numberOfLines={2}
					placeholder="..."
					value={notes}
					onChangeText={(notes) => setNotes(notes)}
					placeholderTextColor={"lightgray"}
				/>
			</View>
			<View style={styles.submitButtonContainer}>
				{isWeb() ? (
					<>
						{user ? (
							<>
								<button
									style={styles.submitButton}
									onClick={submitDeal}
								>
									Submit
								</button>
								<ThemedText style={{ marginTop: 10 }}>
									<em>Signed in as {user?.displayName} </em>(
									<a
										href="#"
										onClick={signOut}
										style={{
											color: "white",
										}}
									>
										sign out
									</a>
									)
								</ThemedText>
							</>
						) : (
							<>
								<button
									onClick={signInWithGoogle}
									color={Colors.shared.bobaBrownDark}
									style={styles.submitButton}
								>
									Sign in with Google to add a deal
								</button>
								<ThemedText style={{ marginTop: 20 }}>
									Note you must be to added to a Firebase rule
									in order to add a deal (so you probably
									won't be able to submit a deal despite this
									auth).
								</ThemedText>
							</>
						)}
					</>
				) : (
					<Button
						title="Submit"
						color={Colors.shared.bobaOrange}
						onPress={submitDeal}
					/>
				)}
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	inputContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
	dateInputContainer: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		marginTop: 20,
		width: "60%",
	},
	textInputContainer: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		width: "85%",
	},
	inputCol: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		height: 110,
		width: "32%",
	},
	inputRow: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		width: "46%",
	},
	textInput: {
		backgroundColor: "white",
		borderRadius: 10,
		padding: 6,
		paddingLeft: 12,
		fontFamily: "CourierPrime",
		fontSize: 18,
	},
	notesInput: {
		backgroundColor: "white",
		borderRadius: 10,
		padding: 6,
		paddingLeft: 12,
		fontFamily: "CourierPrime",
		fontSize: 18,
		marginTop: 8,
	},
	disabledTextInput: {
		backgroundColor: Colors.shared.bobaBrownLight,
		color: "white",
		borderRadius: 10,
		padding: 6,
		paddingLeft: 12,
		fontFamily: "CourierPrime",
		fontSize: 18,
		height: 46,
	},
	textInputRow: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	dateInputRow: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		alignContent: "center",
	},
	picker: {
		width: 300,
		height: 50,
		fontFamily: "CourierPrime",
		fontSize: 18,
		borderRadius: 10,
		borderColor: "white",
		padding: 6,
		marginBottom: 10,
		marginLeft: 16,
		marginRight: 16,
	},
	thinPicker: {
		height: 40,
		fontFamily: "CourierPrime",
		fontSize: 18,
		borderRadius: 10,
		borderColor: "white",
		padding: 6,
		marginBottom: 10,
	},
	inputNote: {
		marginBottom: 10,
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
	},
	notesInputContainer: {
		display: "flex",
		flexDirection: "column",
		marginTop: 20,
	},
	submitButtonContainer: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	submitButton: {
		marginTop: 10,
		backgroundColor: Colors.shared.bobaOrange,
		width: 200,
		fontFamily: "LondrinaSolid",
		color: "white",
		padding: 10,
		borderRadius: 10,
		fontSize: 24,
		borderColor: Colors.shared.bobaOrange,
		cursor: "pointer",
	},
	googleAuthButton: {
		marginTop: 10,
		backgroundColor: Colors.shared.bobaOrange,
		width: 400,
		fontFamily: "LondrinaSolid",
		color: "white",
		padding: 10,
		borderRadius: 10,
		fontSize: 24,
		borderColor: Colors.shared.bobaOrange,
		cursor: "pointer",
	},
	checkboxRow: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: 200,
	},
})
