import { Colors } from "@/constants/Colors"
import { BobaDeal, Store, StoreDeal, weekdayMap } from "@/constants/types/Deals"
import { ShowDealsForDateContext } from "@/contexts/ShowDealsForDateContext"
import { db } from "@/firebase/app/firebaseConfig"
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	Timestamp,
} from "firebase/firestore"
import React, { useContext, useEffect, useState } from "react"
import { Platform, StyleSheet, View } from "react-native"
import BobaDealCard from "./BobaDealCard"
import StoreDealCard from "./StoreDealCard"
import { ThemedText } from "./ThemedText"

const getStoreFromID = async (id: string): Promise<Store> => {
	const querySnapshot = await getDoc(doc(db, "stores", id))
	return querySnapshot.data() as Store
}

export default function DealsList() {
	const [bobaDeals, setBobaDeals] = useState<BobaDeal[]>([])

	const { showDealsForDate, setShowDealsForDate } = useContext(
		ShowDealsForDateContext,
	)

	const [storeIDToObjMap, setStoreIDToObjMap] = useState(
		new Map<string, Store>(),
	)

	const [storeDeals, setStoreDeals] = useState<StoreDeal[]>([])

	useEffect(() => {
		const retrieveBobaDeals = async () => {
			const q = query(collection(db, "boba-deals"))

			const bobaDealsTemp: BobaDeal[] = []
			const storeIDToObjMapTemp = new Map<string, Store>()

			const querySnapshot = await getDocs(q)
			for (const document of querySnapshot.docs) {
				const data = document.data() as BobaDeal
				bobaDealsTemp.push(data)

				if (!storeIDToObjMapTemp.has(data.storeID)) {
					const store = await getStoreFromID(data.storeID)
					storeIDToObjMapTemp.set(data.storeID, store)
				}
			}

			setBobaDeals(bobaDealsTemp)
			setStoreIDToObjMap(storeIDToObjMapTemp)
		}

		const retrieveStoreDeals = async () => {
			const q = query(collection(db, "store-deals"))

			const storeDealsTemp: StoreDeal[] = []

			const querySnapshot = await getDocs(q)
			for (const document of querySnapshot.docs) {
				const data = document.data() as StoreDeal
				storeDealsTemp.push(data)
			}

			setStoreDeals(storeDealsTemp)
		}

		retrieveBobaDeals()
		retrieveStoreDeals()
	}, [])

	const filteredBobaDeals = bobaDeals.filter((deal) => {
		if (showDealsForDate === null) {
			return true
		}

		if (
			!(
				deal.promoPeriod.startDate === "always" ||
				deal.promoPeriod.endDate === "always"
			)
		) {
			if (
				showDealsForDate < deal.promoPeriod.startDate.toDate() ||
				showDealsForDate > deal.promoPeriod.endDate.toDate()
			) {
				return false
			}
		}

		if (deal.promoPeriod.condition) {
			if ("day" in deal.promoPeriod.condition) {
				if (
					weekdayMap[deal.promoPeriod.condition.day] !==
					Timestamp.fromDate(showDealsForDate).toDate().getDay()
				) {
					return false
				}
			} else if ("date" in deal.promoPeriod.condition) {
				if (
					deal.promoPeriod.condition.date !==
					Timestamp.fromDate(showDealsForDate).toDate().getDate()
				) {
					return false
				}
			}
		}

		return true
	})

	filteredBobaDeals.sort((a, b) => {
		const storeA = storeIDToObjMap.get(a.storeID)
		const storeB = storeIDToObjMap.get(b.storeID)

		if (storeA && storeB) {
			if (storeA.name < storeB.name) {
				return -1
			} else if (storeA.name > storeB.name) {
				return 1
			}
		}
		return 0
	})

	// On desktop, we'll have 3 columns. and because i like grid layouts and flex is being a pain, i'm hacking it.
	// this avoids the problem of different card heights causing the cards to not line up properly
	if (Platform.OS === "web") {
		const COLUMN_COUNT = 3
		const bobaDealsCols: BobaDeal[][] = Array.from(
			{ length: COLUMN_COUNT },
			() => [],
		)

		for (let i = 0; i < filteredBobaDeals.length; i++) {
			const columnIndex = i % COLUMN_COUNT
			bobaDealsCols[columnIndex].push(filteredBobaDeals[i])
		}

		return (
			<View style={styles.allDealsContainer}>
				<View style={styles.dealsContainer}>
					<ThemedText type="subtitle">🧋 Boba Deals</ThemedText>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							rowGap: 20,
						}}
					>
						{bobaDealsCols.map((row, index) => {
							return (
								<View
									key={index}
									style={{
										display: "flex",
										flexDirection: "column",
										width: "29%",
									}}
								>
									{row.map((deal) => {
										return (
											<BobaDealCard
												key={deal.id}
												deal={deal}
												store={storeIDToObjMap.get(
													deal.storeID,
												)}
											/>
										)
									})}
								</View>
							)
						})}
					</View>
				</View>
				<View style={styles.dividerLine} />
				<View style={styles.dealsContainer}>
					<ThemedText type="subtitle">🏪 Store Deals</ThemedText>
					<View style={styles.listContainer}>
						{storeDeals.map((deal) => {
							return (
								<StoreDealCard
									key={deal.id}
									deal={deal}
									store={storeIDToObjMap.get(deal.storeID)}
								/>
							)
						})}
					</View>
				</View>
			</View>
		)
	}

	return (
		<View style={styles.allDealsContainer}>
			<View style={styles.dealsContainer}>
				<ThemedText type="subtitle">🧋 Boba Deals</ThemedText>
				<View style={styles.listContainer}>
					{filteredBobaDeals.map((deal) => {
						return (
							<BobaDealCard
								key={deal.id}
								deal={deal}
								store={storeIDToObjMap.get(deal.storeID)}
							/>
						)
					})}
				</View>
			</View>
			<View style={styles.dividerLine} />
			<View style={styles.dealsContainer}>
				<ThemedText type="subtitle">🏪 Store Deals</ThemedText>
				<View style={styles.listContainer}>
					{storeDeals.map((deal) => {
						return (
							<StoreDealCard
								key={deal.id}
								deal={deal}
								store={storeIDToObjMap.get(deal.storeID)}
							/>
						)
					})}
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	allDealsContainer: {
		display: "flex",
		marginTop: 60,
		padding: 40,
	},
	listContainer: {
		display: "flex",
		flexWrap: "wrap",
		flexDirection: "row",
		alignContent: "space-between",
		justifyContent: "flex-start",
		alignItems: "flex-start",
		marginTop: 20,
		marginBottom: 20,
		gap: 0,
	},
	dealsContainer: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		borderRadius: 20,
		filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
	},
	dividerLine: {
		borderBottomColor: Colors.shared.bobaBrownLight,
		borderBottomWidth: StyleSheet.hairlineWidth,
		marginBottom: 10,
		marginTop: 10,
	},
})
