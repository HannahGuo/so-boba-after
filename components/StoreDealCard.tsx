import { Colors } from "@/constants/Colors"
import { Store, StoreDeal } from "@/constants/types/Deals"
import { StyleSheet, View } from "react-native"
import { ThemedText } from "./ThemedText"
import { makeDealText, makePromoPeriodText } from "./helpers/dealHelpers"

type StoreDealProps = {
	deal: StoreDeal
	store: Store | undefined
	storeDeals?: StoreDeal[]
}

export default function StoreDealCard({
	deal,
	store,
	storeDeals,
}: StoreDealProps) {
	const notes = deal.condition.notes
	return (
		<View
			style={{
				backgroundColor: Colors.shared.bobaOrange,
				...styles.dealContainer,
			}}
		>
			<ThemedText type="subtitle">{store?.name}</ThemedText>
			<ThemedText type="defaultBold">{deal.condition.clause}</ThemedText>
			<ThemedText type="default">🎉 {makeDealText(deal)}</ThemedText>
			<View style={styles.dividerLine} />
			<ThemedText type="default">
				📅 {makePromoPeriodText(deal.promoPeriod)}
			</ThemedText>
			{notes && <ThemedText type="default">📝 {notes}</ThemedText>}
		</View>
	)
}

const styles = StyleSheet.create({
	dealContainer: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		padding: 20,
		width: 460,
		borderRadius: 20,
		margin: 10,
		filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
	},
	dividerLine: {
		borderBottomColor: "white",
		borderBottomWidth: StyleSheet.hairlineWidth,
		marginBottom: 10,
		marginTop: 10,
	},
})
