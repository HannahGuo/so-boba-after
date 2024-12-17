import { StyleSheet, View } from "react-native";
import Deal from "./Deal";

export default function DealsList() {
    const bobaDeals: BobaDeal[] = [
        {
            id: 'test123', storeID: 'The Alley', dealType: 'single', // TODO: make storeID real
            discounts: [{
                discountType: "percentage",
                discountValue: 50
            }],
            drinks: [{
                name: "Royal No. 9 Milk Tea",
                size: "any",
                type: "milktea",
            }],
            promoPeriod: {
                startDate: "always",
                endDate: "always",
                condition: {
                    date: 9,
                }
            },
            notes: "Needs app, limit 2 per app"
        },
        {
            id: 'test123', storeID: 'The Alley', dealType: 'single', // TODO: make storeID real
            discounts: [{
                discountType: "percentage",
                discountValue: 50
            }],
            drinks: [{
                name: "Royal No. 9 Milk Tea",
                size: "any",
                type: "milktea",
            }],
            promoPeriod: {
                startDate: "always",
                endDate: "always",
                condition: {
                    date: 9,
                }
            },
            notes: "Needs app, limit 2 per app"
        },
        {
            id: 'test123', storeID: 'The Alley', dealType: 'single', // TODO: make storeID real
            discounts: [{
                discountType: "percentage",
                discountValue: 50
            }],
            drinks: [{
                name: "Royal No. 9 Milk Tea",
                size: "any",
                type: "milktea",
            }],
            promoPeriod: {
                startDate: "always",
                endDate: "always",
                condition: {
                    date: 9,
                }
            },
            notes: "Needs app, limit 2 per app"
        },
        {
            id: 'test123', storeID: 'The Alley', dealType: 'single', // TODO: make storeID real
            discounts: [{
                discountType: "percentage",
                discountValue: 50
            }],
            drinks: [{
                name: "Royal No. 9 Milk Tea",
                size: "any",
                type: "milktea",
            }],
            promoPeriod: {
                startDate: "always",
                endDate: "always",
                condition: {
                    date: 9,
                }
            },
            notes: "Needs app, limit 2 per app"
        },
    ];

    const stores = {}

    return (
        <View style={styles.listContainer}>
            {bobaDeals.map((deal) => {
                return (
                    <Deal key={deal.id} deal={deal}/>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: 10,
        marginTop: 120,
        justifyContent: 'space-between',
        alignContent: 'space-between',
    },
});