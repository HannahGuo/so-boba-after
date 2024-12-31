import { ThemedText } from "@/components/ThemedText"
import { Colors } from "@/constants/Colors"
import {
	Condition,
	DiscountType,
	Store,
	StoreDeal,
} from "@/constants/types/Deals"
import { db } from "@/firebase/app/firebaseConfig"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Picker } from "@react-native-picker/picker"
import Checkbox from "expo-checkbox"
import { collection, doc, getDocs, setDoc, Timestamp } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { Button, Platform, StyleSheet, TextInput, View } from "react-native"

export default function AddStoreDeal({ storesList }: { storesList: Store[] }) {
	const [storeName, setStoreName] = useState<string>()

	const [startDate, setStartDate] = useState<Date>(new Date())
	const [endDate, setEndDate] = useState<Date>(new Date())

	const [discountType, setDiscountType] = useState<DiscountType>("percentage")
	const [discountValue, setDiscountValue] = useState<number>(NaN)

	const [isDiscountAlwaysActive, setDiscountAlwaysActive] = useState(true)

	const [condition, setCondition] = useState<string>()

	const [existingConditions, setExistingConditions] = useState<Condition[]>(
		[],
	)

	function resetForm() {
		setStoreName("")
		setStartDate(new Date())
		setEndDate(new Date())
		setDiscountType("percentage")
		setDiscountValue(NaN)
		setDiscountAlwaysActive(true)
		setCondition("")
	}

	async function submitStoreDeal() {
		const dealID =
			Math.random().toString(36).substring(2, 15) +
			Math.random().toString(36).substring(2, 15)

		let conditionID: string | undefined = undefined
		if (existingConditions.some((c) => c.clause != condition)) {
			conditionID =
				Math.random().toString(36).substring(2, 15) +
				Math.random().toString(36).substring(2, 15)

			// new condition
			const newCondition: Condition = {
				clause: condition ?? "",
				id: conditionID,
			}
			await setDoc(doc(db, "conditions", conditionID), newCondition)
		} else {
			conditionID = existingConditions.find(
				(c) => c.clause == condition,
			)?.id
		}

		const constructedDeal: StoreDeal = {
			id: dealID,
			storeID: storesList.find((s) => s.name == storeName)?.id ?? "",
			condition: {
				id: conditionID ?? "",
				clause: condition ?? "",
			},
			promoPeriod: {
				startDate: isDiscountAlwaysActive
					? "always"
					: Timestamp.fromDate(startDate),
				endDate: isDiscountAlwaysActive
					? "always"
					: Timestamp.fromDate(endDate),
			},
			discount: {
				discountType: discountType,
				discountValue: discountValue,
			},
		}

		await setDoc(doc(db, "store-deals", dealID), constructedDeal)
		resetForm()
	}

	useEffect(() => {
		const fetchData = async () => {
			const querySnapshot = await getDocs(collection(db, "conditions"))
			const conditionsList: Condition[] = querySnapshot.docs.map(
				(doc) => {
					const data = doc.data() as Condition
					return { ...data, id: doc.id }
				},
			)

			setExistingConditions(conditionsList)
		}
		fetchData()
	}, [])

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
			<View style={{ marginTop: 12 }}>
				<ThemedText type="subtitle">Discount Amount:</ThemedText>
				<View style={styles.inputRow}>
					{Platform.OS === "web" ? (
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
						<Picker.Item label="Percentage" value="percentage" />
						<Picker.Item label="Flat Off" value="flatoff" />
					</Picker>
				</View>
			</View>
			<View style={styles.dateInputContainer}>
				<ThemedText type="subtitle">Dates Active:</ThemedText>
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
						{Platform.OS === "web" ? (
							<input
								type="date"
								style={styles.dateInput}
								value={startDate.toISOString().substring(0, 10)}
								onChange={(e) =>
									setStartDate(new Date(e.target.value))
								}
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
						{Platform.OS === "web" ? (
							<input
								style={styles.dateInput}
								type="date"
								value={endDate.toISOString().substring(0, 10)}
								onChange={(e) =>
									setEndDate(new Date(e.target.value))
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
				<View style={styles.notesInputContainer}>
					<ThemedText type="subtitle">Condition:</ThemedText>
					<ThemedText>
						Select from one of the existing conditions:
					</ThemedText>
					<Picker
						style={styles.picker}
						selectedValue={discountType}
						onValueChange={(itemValue) => setCondition(itemValue)}
					>
						{existingConditions.map((condition) => (
							<Picker.Item
								label={condition.clause}
								value={condition.id}
								key={condition.id}
							/>
						))}
					</Picker>
					<ThemedText>or add a new one:</ThemedText>
					<TextInput
						style={styles.notesInput}
						multiline={true}
						numberOfLines={2}
						placeholder="..."
						value={condition}
						onChangeText={(c) => setCondition(c)}
						placeholderTextColor={"lightgray"}
					/>
				</View>

				<View style={styles.submitButtonContainer}>
					{Platform.OS === "web" ? (
						<button
							style={styles.submitButton}
							onClick={submitStoreDeal}
						>
							Submit
						</button>
					) : (
						<Button
							title="Submit"
							color={Colors.shared.bobaOrange}
							onPress={submitStoreDeal}
						/>
					)}
				</View>
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	inputContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		width: "65%",
		alignItems: "center",
	},
	dateInputContainer: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		marginTop: 20,
		width: "85%",
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
		marginTop: 10,
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
	checkboxRow: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: 200,
	},
})
