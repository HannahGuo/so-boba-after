import { BobaDeal, Store } from "@/constants/types/Deals"
import { db } from "@/firebase/app/firebaseConfig"
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import Deal from "./Deal"

const getStoreFromID = async (id: string): Promise<Store> => {
	const querySnapshot = await getDoc(doc(db, "stores", id))
	return querySnapshot.data() as Store
}

export default function DealsList() {
	const [bobaDeals, setBobaDeals] = useState<BobaDeal[]>([])

	const [storeIDToObjMap, setStoreIDToObjMap] = useState(
		new Map<string, Store>(),
	)

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

		retrieveBobaDeals()
	}, [])

	return (
		<View style={styles.listContainer}>
			{bobaDeals.map((deal) => {
				console.log(
					{ bobaDeals, storeIDToObjMap },
					deal.storeID,
					storeIDToObjMap.get(deal.storeID),
				)

				return (
					<Deal
						key={deal.id}
						deal={deal}
						store={storeIDToObjMap.get(deal.storeID)}
					/>
				)
			})}
		</View>
	)
}

const styles = StyleSheet.create({
	listContainer: {
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		margin: 10,
		marginTop: 120,
		justifyContent: "space-between",
		alignContent: "space-between",
	},
})
