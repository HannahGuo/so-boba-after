import {
	BobaDeal,
	compareDiscounts,
	Store,
	StoreDeal,
	weekdayMap,
} from "@/constants/types/Deals"
import { ShowDealsForDateContext } from "@/contexts/ShowDealsForDateContext"
import { SortAndFilterContext } from "@/contexts/SortAndFilterContext"
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
import { StyleSheet, View } from "react-native"
import BobaDealCard from "./BobaDealCard"
import StoreDealCard from "./StoreDealCard"
import { ThemedText } from "./ThemedText"

import { isDesktop, isMobileDevice } from "./helpers/deviceHelpers"

const getStoreFromID = async (id: string): Promise<Store> => {
	const querySnapshot = await getDoc(doc(db, "stores", id))
	return querySnapshot.data() as Store
}

export default function DealsList() {
	const [bobaDeals, setBobaDeals] = useState<BobaDeal[]>([])

	const { showDealsForDate } = useContext(ShowDealsForDateContext)

	const [storeIDToObjMap, setStoreIDToObjMap] = useState(
		new Map<string, Store>(),
	)

	const [storeDeals, setStoreDeals] = useState<StoreDeal[]>([])

	const { sortType, numberOfDrinks } = useContext(SortAndFilterContext)

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

		if (numberOfDrinks === "one") {
			if (deal.dealType === "bogo" || deal.dealType === "buyXforY") {
				return false
			}
		}

		return true
	})

	filteredBobaDeals.sort((a, b) => {
		switch (sortType) {
			case "storeName":
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
			case "expiry":
				if (a.promoPeriod.endDate < b.promoPeriod.endDate) {
					return -1
				} else if (a.promoPeriod.endDate > b.promoPeriod.endDate) {
					return 1
				}
				return 0
			case "price":
			default:
				// TODO: this is wrong lol
				return compareDiscounts(a.discount, b.discount)
		}
	})

	const isDesktopCheck: boolean = isDesktop()
	const isMobileDeviceCheck: boolean = isMobileDevice()

	if (!bobaDeals) {
		return null
	}

	// On desktop, we'll have 3 columns. and because i like grid layouts and flex is being a pain, i'm hacking it.
	// this avoids the problem of different card heights causing the cards to not line up properly

	const COLUMN_COUNT = isDesktopCheck ? 3 : 1
	const bobaDealsCols: BobaDeal[][] = Array.from(
		{ length: COLUMN_COUNT },
		() => [],
	)

	for (let i = 0; i < filteredBobaDeals.length; i++) {
		const columnIndex = i % COLUMN_COUNT
		bobaDealsCols[columnIndex].push(filteredBobaDeals[i])
	}

	return (
		<View
			style={{
				...styles.allDealsContainer,
				...(!isDesktopCheck
					? {
							marginTop: 100,
							padding: 20,
					  }
					: { padding: 40, marginTop: 60 }),
			}}
		>
			<View style={styles.dealsContainer}>
				<ThemedText type="subtitle">🧋 Boba Deals</ThemedText>
				<View style={styles.rowContainer}>
					{bobaDealsCols.map((row, index) => {
						return (
							<View
								key={index}
								style={{
									display: "flex",
									flexDirection: "column",
									width: isMobileDeviceCheck ? "100%" : "29%",
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
			<View style={styles.spacer} />
			<View style={styles.dealsContainer}>
				<ThemedText type="subtitle">🏪 Store Deals</ThemedText>
				<ThemedText type="subsubtitle">
					Probably not stackable with drink-specific deals above.
				</ThemedText>
				<View
					style={[
						styles.rowContainer,
						{
							display: "flex",
							flexDirection: "column",
							width: isMobileDeviceCheck ? "100%" : "29%",
						},
					]}
				>
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
	},
	listContainer: {
		display: "flex",
		flexWrap: "wrap",
		flexDirection: "row",
		alignContent: "space-between",
		justifyContent: "flex-start",
		alignItems: "flex-start",
		marginTop: 10,
		gap: 0,
	},
	dealsContainer: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		borderRadius: 20,
		filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
	},
	spacer: {
		marginBottom: 20,
		marginTop: 10,
	},
	rowContainer: {
		display: "flex",
		flexDirection: "row",
		rowGap: 20,
	},
})
