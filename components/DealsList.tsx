import { Colors } from "@/constants/Colors"
import { BobaDeal, Store, StoreDeal } from "@/constants/types/Deals"
import { db } from "@/firebase/app/firebaseConfig"
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import BobaDealCard from "./BobaDealCard"
import StoreDealCard from "./StoreDealCard"
import { ThemedText } from "./ThemedText"

const getStoreFromID = async (id: string): Promise<Store> => {
	const querySnapshot = await getDoc(doc(db, "stores", id))
	return querySnapshot.data() as Store
}

export default function DealsList() {
	const [bobaDeals, setBobaDeals] = useState<BobaDeal[]>([])

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

	return (
		<View style={styles.allDealsContainer}>
			<View style={styles.dealsContainer}>
				<ThemedText type="subtitle">🧋 Boba Deals</ThemedText>
				<View style={styles.listContainer}>
					{bobaDeals.map((deal) => {
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
		alignItems: "flex-start",
		marginTop: 20,
		marginBottom: 20,
		gap: 20,
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
