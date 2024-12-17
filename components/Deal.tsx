import { Colors } from "@/constants/Colors";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { isDateCondition, isDayCondition } from "./helpers/typeHelpers";


type DealProps = {
    deal: BobaDeal
    storeDeals?: StoreDeal[]
}

function makeDiscountText(discount: Discount) {
    switch (discount.discountType) {
        case 'percentage':
            return `${discount.discountValue}% off`
        case 'flatoff':
            return `$${discount.discountValue} off`
        case 'total':
            return `$${discount.discountValue} total`
        default:
            return 'Unknown discount type'
    }
}

function makeSizeText(size: string) {
    if(size === 'any') {
        return 'any size'
    }

    return size
}

function chooseBackgroundColor(drinkName: string) {
    const normalizeDrinkName = drinkName.toLowerCase()
    if(normalizeDrinkName.includes('milk')) {
        return `linear-gradient(to top, ${Colors.shared.bobaBrown}, 95%, ${Colors.shared.bobaBrownLight})`
    }

    return Colors.shared.bobaPurple
}

function makePromoPeriodText(promoPeriod: PromoPeriod): string {
    if(promoPeriod.condition) {
        if(isDateCondition(promoPeriod.condition)) {
            return `Every ${promoPeriod.condition.date}th of the month`
        }

        if(isDayCondition(promoPeriod.condition)) {
            return `Every ${promoPeriod.condition.day}`
        }
    }

    if(promoPeriod.startDate === 'always' && promoPeriod.endDate === 'always') {
        return 'Always'
    }

    return `${promoPeriod.startDate} to ${promoPeriod.endDate}`
}

export default function Deal({deal, storeDeals}: DealProps) {

    return (
        <View style={{backgroundImage: chooseBackgroundColor(deal.drinks[0].name),...styles.dealContainer}}>
            <ThemedText type='subtitle'>{deal.storeID}</ThemedText>
            <ThemedText type='defaultBold'>{deal.drinks[0].name}</ThemedText>
            <ThemedText type='default'>{makeDiscountText(deal.discounts[0])} {makeSizeText(deal.drinks[0].size)}</ThemedText>
            <View style={styles.dividerLine}/>
            <ThemedText type='default'>📅 {makePromoPeriodText(deal.promoPeriod)}</ThemedText>
            <ThemedText type='default'>📝 {deal.notes}</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    dealContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 20,
        width: 400,
        borderRadius: 20,
        margin: 12,
    },
    dividerLine: {
        borderBottomColor: 'white',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 10,
        marginTop: 10,
    }
})