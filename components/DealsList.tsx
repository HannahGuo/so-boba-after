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


    const storeDeals: StoreDeal[] = [{
        storeID: 'Now Tea',
        id: "now-tea-boba",
        condition: {
            id: "bobatime-card",
            clause: "Needs UW BobaTime Card",
        },
        promoPeriod: {
            startDate: "always",
            endDate: "always",
        },
        discount: {
            discountType: "percentage",
            discountValue: 10
        }
    }]


    const stores: Store[] = [
        {
            id: "Now Tea",
            name: "Now Tea",
            address: "280 Lester St #106, Waterloo, ON N2L 0G2"
        }
    ]

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const testDoc = await setDoc(doc(db, "cities", "LA"), {
    //             name: "Los Angeles",
    //             state: "CA",
    //             country: "USA"
    //         });
    //     };
    //     fetchData();
    // }, []);

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