import {
	BobaDeal,
	compareDiscounts,
	Deal,
	isBobaDeal,
	isStoreDeal,
	Store,
	StoreDeal,
	weekdayMap,
} from "@/constants/types/Deals"
import { ShowDealsForDateContext } from "@/contexts/ShowDealsForDateContext"
import { SortAndFilterContext } from "@/contexts/SortAndFilterContext"
import { db } from "@/firebase/app/firebaseConfig"
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore"
import React, { useContext, useEffect, useState } from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"

import { Colors } from "@/constants/Colors"
import BobaDealCard from "./BobaDealCard"
import { getNewDateWithNoTime } from "./helpers/dateHelpers"
import { useIsDesktop, useIsMobileDevice } from "./helpers/deviceHelpers"
import StoreDealCard from "./StoreDealCard"

const getStoreFromID = async (id: string): Promise<Store> => {
	const querySnapshot = await getDoc(doc(db, "stores", id))
	return querySnapshot.data() as Store
}

export default function DealsList() {
	const [bobaDeals, setBobaDeals] = useState<BobaDeal[] | null>(null)
	const [storeDeals, setStoreDeals] = useState<StoreDeal[] | null>(null)
	const [storeIDToObjMap, setStoreIDToObjMap] = useState(
		new Map<string, Store>(),
	)

	const isDesktopCheck: boolean = useIsDesktop()
	const isMobileDeviceCheck: boolean = useIsMobileDevice()

	const [loading, setLoading] = useState(true)

	const { showDealsForDate } = useContext(ShowDealsForDateContext)
	const {
		sortType,
		numberOfDrinks,
		storeName: filteredStoreName,
	} = useContext(SortAndFilterContext)

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

		const fetchAllData = async () => {
			setLoading(true)
			await Promise.all([retrieveBobaDeals(), retrieveStoreDeals()])
			setLoading(false)
		}

		fetchAllData()
	}, [])

	if (loading || !bobaDeals || !storeDeals) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator
					size="large"
					color={Colors.shared.bobaBrownDark}
				/>
			</View>
		)
	}

	const filteredBobaDeals = bobaDeals.filter((deal) => {
		if (showDealsForDate === null) return true
		if (
			!(
				deal.promoPeriod.startDate === "always" ||
				deal.promoPeriod.endDate === "always"
			)
		) {
			if (
				getNewDateWithNoTime(showDealsForDate) <
					getNewDateWithNoTime(deal.promoPeriod.startDate.toDate()) ||
				getNewDateWithNoTime(showDealsForDate) >
					getNewDateWithNoTime(deal.promoPeriod.endDate.toDate())
			) {
				return false
			}
		}

		if (deal.promoPeriod.condition) {
			if ("day" in deal.promoPeriod.condition) {
				if (
					weekdayMap[deal.promoPeriod.condition.day] !==
					getNewDateWithNoTime(showDealsForDate).getDay()
				) {
					return false
				}
			} else if ("date" in deal.promoPeriod.condition) {
				if (
					deal.promoPeriod.condition.date !==
					getNewDateWithNoTime(showDealsForDate).getDate()
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

		if (filteredStoreName !== "any") {
			const store = storeIDToObjMap.get(deal.storeID)
			if (store) {
				if (
					!store.name
						.toLowerCase()
						.includes(filteredStoreName.toLowerCase())
				) {
					return false
				}
			}
		}

		return true
	})

	const filteredStoreDeals = storeDeals.filter((deal) => {
		if (showDealsForDate === null) return true
		if (
			!(
				deal.promoPeriod.startDate === "always" ||
				deal.promoPeriod.endDate === "always"
			)
		) {
			if (
				showDealsForDate <
					getNewDateWithNoTime(deal.promoPeriod.startDate.toDate()) ||
				showDealsForDate >
					getNewDateWithNoTime(deal.promoPeriod.endDate.toDate())
			) {
				return false
			}
		}

		if (deal.promoPeriod.condition) {
			if ("day" in deal.promoPeriod.condition) {
				if (
					weekdayMap[deal.promoPeriod.condition.day] !==
					getNewDateWithNoTime(showDealsForDate).getDay()
				) {
					return false
				}
			} else if ("date" in deal.promoPeriod.condition) {
				if (
					deal.promoPeriod.condition.date !==
					getNewDateWithNoTime(showDealsForDate).getDate()
				) {
					return false
				}
			}
		}

		if (filteredStoreName !== "any") {
			const store = storeIDToObjMap.get(deal.storeID)
			if (store) {
				if (
					!store.name
						.toLowerCase()
						.includes(filteredStoreName.toLowerCase())
				) {
					return false
				}
			}
		}

		return true
	})

	const allDeals = [...filteredBobaDeals, ...filteredStoreDeals]

	allDeals.sort((a, b) => {
		switch (sortType) {
			case "storeName":
				const storeA = storeIDToObjMap.get(a.storeID)
				const storeB = storeIDToObjMap.get(b.storeID)
				if (storeA && storeB) {
					if (storeA.name < storeB.name) return -1
					else if (storeA.name > storeB.name) return 1
				}
				return 0
			case "expiry":
				if (a.promoPeriod.endDate < b.promoPeriod.endDate) return -1
				else if (a.promoPeriod.endDate > b.promoPeriod.endDate) return 1
				return 0
			case "price":
			default:
				return compareDiscounts(a.discount, b.discount)
		}
	})

	// 2 columns on desktop, 1 column on mobile
	const COLUMN_COUNT = isDesktopCheck ? 2 : 1

	const bobaDealsCols: Deal[][] = Array.from(
		{ length: COLUMN_COUNT },
		() => [],
	)
	for (let i = 0; i < allDeals.length; i++) {
		const columnIndex = i % COLUMN_COUNT
		bobaDealsCols[columnIndex].push(allDeals[i])
	}

	return (
		<View
			style={{
				...styles.allDealsContainer,
			}}
		>
			<View style={styles.dealsContainer}>
				<View style={styles.rowContainer}>
					{bobaDealsCols.map((row, index) => (
						<View
							key={index}
							style={{
								display: "flex",
								flexDirection: "column",
								width: isMobileDeviceCheck ? "100%" : "50%",
							}}
						>
							{row.map((deal) => {
								if (isBobaDeal(deal)) {
									return (
										<BobaDealCard
											key={deal.dealID}
											deal={deal}
											store={storeIDToObjMap.get(
												deal.storeID,
											)}
										/>
									)
								} else if (isStoreDeal(deal)) {
									const store = storeIDToObjMap.get(
										deal.storeID,
									)
									if (store) {
										return (
											<StoreDealCard
												key={deal.dealID}
												deal={deal}
												store={store}
											/>
										)
									}
								} else {
									console.error(
										"Deal is neither BobaDeal nor StoreDeal",
									)
								}
							})}
						</View>
					))}
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	allDealsContainer: {
		display: "flex",
		padding: 20,
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
