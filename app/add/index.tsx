import Header from "@/components/Header";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { db } from "@/firebase/app/firebaseConfig";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, Platform, ScrollView, StyleSheet, TextInput, View } from "react-native";

function makeDrinkHolderPlaceholder(drinkNumber: number, dealType: BobaDealType | undefined): string {
    if (dealType === 'single' && drinkNumber > 1) {
        return 'Only one drink for single deals';
    }

    if (dealType === 'bogo' && drinkNumber === 3) {
        return 'Only two drinks for BOGO';
    }

    return `Drink Name`;
}

function makeDiscountInfoString(dealType: BobaDealType | undefined): string {
    switch(dealType) {
        case 'single':
            return 'For Single deal type, this is the discount on any one drink.';
        case 'bogo':
            return 'For BOGO deal type, this is the discount on second drink (first is assumed to be full-price)';
        case 'buyXforY':
            return 'For Buy X for Y deal type, this is the discount on all drinks.';
        default: 
            return 'Discount on total';
    }
}

function determineDrinkTypeFromName(drinkName: string): DrinkType {
    if (drinkName.toLowerCase().includes('milk')) {
        return 'milktea';
    } else if (drinkName.toLowerCase().includes('fruit tea')) {
        return 'fruittea';
    } else if (drinkName.toLowerCase().includes('slush')) {
        return 'slush';
    } else {
        return 'other';
    }
}

export default function Add() {
    const [storeName, setStoreName] = useState<string>();
    const [dealType, setDealType] = useState<BobaDealType>('single');
    
    const [drinkNameOne, setDrinkNameOne] = useState<string>();
    const [drinkSizeOne, setDrinkSizeOne] = useState<DrinkSize>('any'); 

    const [drinkNameTwo, setDrinkNameTwo] = useState<string>();
    const [drinkSizeTwo, setDrinkSizeTwo] = useState<DrinkSize>('any');

    const [drinkNameThree, setDrinkNameThree] = useState<string>();
    const [drinkSizeThree, setDrinkSizeThree] = useState<DrinkSize>('any');

    const allowDrinkTwo = dealType !== 'single';
    const allowDrinkThree = dealType !== 'single' && dealType !== 'bogo';

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [dayCondition, setDayCondition] = useState<DayCondition | null>(null);

    const [notes, setNotes] = useState<string>();

    const [discountType, setDiscountType] = useState<DiscountType>('percentage');
    const [discountValue, setDiscountValue] = useState<number>(NaN);

    const [storesList, setStoresList] = useState<Store[]>([]);

    function validateForm(): boolean {
        if (!storeName || !dealType || !drinkNameOne || !drinkSizeOne || !discountType || isNaN(discountValue)) {
            console.log('missing required fields');
            return false;
        }

        if (allowDrinkTwo && (!drinkNameTwo || !drinkSizeTwo)) {
            return false;
        }

        if (allowDrinkThree && (!drinkNameThree || !drinkSizeThree)) {
            return false;
        }

        return true;
    }

    async function submitDeal() {
        const dealID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const drinksList = []

        if (drinkNameOne) {
            drinksList.push({
                name: drinkNameOne,
                type: determineDrinkTypeFromName(drinkNameOne),
                size: drinkSizeOne,
            });
        }

        if (drinkNameTwo) {
            drinksList.push({
                name: drinkNameTwo,
                type: determineDrinkTypeFromName(drinkNameTwo),
                size: drinkSizeTwo,
            });
        }

        if (drinkNameThree) {
            drinksList.push({
                name: drinkNameThree,
                type: determineDrinkTypeFromName(drinkNameThree),
                size: drinkSizeThree,
            });
        }

        const constructedDeal: BobaDeal = {
            id: dealID,
            storeID: storesList.find(store => store.name === storeName)?.id ?? '',
            dealType: dealType,
            drinks: drinksList,
            promoPeriod: {
                startDate: startDate,
                endDate: endDate,
                condition: dayCondition!,
            },
            discounts: [{
                discountType: discountType,
                discountValue: discountValue,
            }],
            notes: ""
        }

        await setDoc(doc(db, "boba-deals", dealID), constructedDeal); 
    }

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "stores"));
            const storesList = querySnapshot.docs.map(doc => doc.data() as Store);
            storesList.sort((a, b) => a.name.localeCompare(b.name));
            setStoresList(storesList);
        };
        document.title = "add boba deal";      
        fetchData();
    }, []);

    return (
        <ScrollView style={styles.mainContainer}>
            <Header page='add'/>
            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <ThemedText type="subtitle">Store Name:</ThemedText>
                    <Picker
                        style={styles.picker}
                        selectedValue={storeName}
                        onValueChange={(itemValue) => setStoreName(itemValue)}>
                        {storesList.map(store => (
                            <Picker.Item label={store.name} value={store.name} key={store.name} />
                        ))}
                    </Picker>
                </View>
                <View style={styles.inputContainer}>
                    <ThemedText type="subtitle">Deal Type:</ThemedText>
                    <Picker
                        style={styles.picker}
                        selectedValue={dealType}
                        onValueChange={(itemValue) => setDealType(itemValue)}>
                        <Picker.Item label="Single" value='single' />
                        <Picker.Item label="BOGO" value="bogo" />
                        <Picker.Item label="Buy X for Y" value="buyXforY" />
                        <Picker.Item label="Other" value="other" />
                    </Picker>
                </View>
                <View style={styles.textInputContainer}>
                    <ThemedText type="subtitle">Drink Name(s):</ThemedText>
                    <View style={styles.textInputRow}>
                        <View style={styles.inputCol}>
                            <TextInput
                                style={{...styles.textInput, height: 46}}
                                placeholder={makeDrinkHolderPlaceholder(1, dealType)}
                                value={drinkNameOne}
                                onChangeText={setDrinkNameOne}
                                placeholderTextColor={'lightgray'}
                            />
                            <Picker 
                                style={styles.thinPicker}
                                selectedValue={drinkSizeOne}
                                onValueChange={(itemValue) => setDrinkSizeOne(itemValue)}>
                                <Picker.Item label="Any Size" value="any" />
                                <Picker.Item label="Regular" value="regular" />
                                <Picker.Item label="Large" value="large" />
                            </Picker>
                        </View>
                        <View style={styles.inputCol}>
                            <TextInput
                                style={{...(!allowDrinkTwo ? styles.disabledTextInput : styles.textInput), height: 46}}
                                placeholder={makeDrinkHolderPlaceholder(2, dealType)}
                                value={drinkNameTwo}
                                onChangeText={setDrinkNameTwo}
                                editable={allowDrinkTwo}
                                placeholderTextColor={!allowDrinkTwo ? 'white' : 'lightgray'}
                            />
                            <Picker 
                                enabled={allowDrinkTwo}
                                style={styles.thinPicker}
                                selectedValue={drinkSizeTwo}
                                onValueChange={(itemValue) => setDrinkSizeTwo(itemValue)}>
                                <Picker.Item label="Any Size" value="any" />
                                <Picker.Item label="Regular" value="regular" />
                                <Picker.Item label="Large" value="large" />
                            </Picker>
                            </View>
                        <View style={styles.inputCol}>
                            <TextInput
                                style={{...(!allowDrinkThree ? styles.disabledTextInput : styles.textInput), height: 46}}
                                placeholder={makeDrinkHolderPlaceholder(3, dealType)}
                                value={drinkNameThree}
                                onChangeText={setDrinkNameThree}
                                editable={allowDrinkThree}
                                placeholderTextColor={!allowDrinkThree ? 'white' : 'lightgray'}
                            />
                            <Picker 
                                enabled={allowDrinkThree}
                                style={styles.thinPicker}
                                selectedValue={drinkSizeThree}
                                onValueChange={(itemValue) => setDrinkSizeThree(itemValue)}>
                                <Picker.Item label="Any Size" value="any" />
                                <Picker.Item label="Regular" value="regular" />
                                <Picker.Item label="Large" value="large" />
                            </Picker>
                            </View>
                        </View>
                    <ThemedText style={styles.inputNote}>If the deal is for “one of XYZ” input all drinks in one box.</ThemedText>
                </View>
                <View style={{marginTop: 12}}>
                    <ThemedText type="subtitle">Drink Promotion:</ThemedText>
                    <View style={styles.inputRow}>
                    {Platform.OS === 'web' ? (
                        <input
                            type="number"
                            value={discountValue}
                            onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            setDiscountValue(value);
                            }}
                            style={{...styles.picker, height: 34}}
                        />
                        ) : (
                        <TextInput
                            style={styles.textInput}
                            value={discountValue.toString()}
                            onChangeText={(text) => {
                            const value = parseFloat(text);
                            setDiscountValue(value);
                            }}
                            keyboardType="decimal-pad"
                            placeholderTextColor="lightgray"
                        />
                        )}
                    <Picker
                        style={styles.picker}
                        selectedValue={discountType}
                        onValueChange={(itemValue) => setDiscountType(itemValue)}>
                        <Picker.Item label="Percentage" value="percentage" />
                        <Picker.Item label="Flat Off" value="flatoff" />
                        <Picker.Item label="Total" value="total" />
                    </Picker>
                    </View>
                    <ThemedText style={styles.inputNote}>{makeDiscountInfoString(dealType)}</ThemedText>
                </View>
                <View style={styles.dateInputContainer}>
                    <ThemedText type="subtitle">Deal Dates:</ThemedText>
                    <View style={styles.dateInputRow}>
                        <ThemedText type="subsubtitle">Start Date:</ThemedText>
                        <View>
                        {Platform.OS === 'web' ? (
                            <input
                                type="date"
                                style={styles.dateInput}
                                value={startDate.toISOString().substr(0,10)}
                                onChange={(e) => setStartDate(new Date(e.target.value))}
                            />
                            ) : (
                            <DateTimePicker
                                value={startDate}
                                mode='date'
                                onChange={(event, selectedDate) => selectedDate && setStartDate(selectedDate)}
                            />
                        )}
                        </View>
                        <ThemedText type="subsubtitle">End Date:</ThemedText>
                        <View>
                            {Platform.OS === 'web' ? (
                                <input
                                    style={styles.dateInput}
                                    type="date"
                                    value={endDate.toISOString().substr(0,10)}
                                    onChange={(e) => setEndDate(new Date(e.target.value))}
                                />
                            ) : (
                                <DateTimePicker
                                    value={endDate}
                                    mode='date'
                                    onChange={(_, selectedDate) => selectedDate && setEndDate(selectedDate)}
                                />
                            )}
                        </View>
                        <ThemedText type="subsubtitle">Day Condition:</ThemedText>
                        <Picker
                            style={styles.thinPicker}
                            selectedValue={dayCondition}
                            onValueChange={(itemValue) => setDayCondition(itemValue)}>
                            <Picker.Item label="None" value={null} />
                            <Picker.Item label="Monday" value="monday" />
                            <Picker.Item label="Tuesday" value="tuesday" />
                            <Picker.Item label="Wednesday" value="wednesday" />
                            <Picker.Item label="Thursday" value="thursday" />
                            <Picker.Item label="Friday" value="friday" />
                            <Picker.Item label="Saturday" value="saturday" />
                            <Picker.Item label="Sunday" value="sunday" />
                        </Picker>
                    </View>
                </View>
                <View style={styles.notesInputContainer}>
                    <ThemedText type="subtitle">Notes:</ThemedText>
                    <TextInput
                        style={styles.notesInput}
                        multiline={true}
                        numberOfLines={2}
                        placeholder="..."
                        value={notes}
                        onChangeText={setNotes}
                        placeholderTextColor={'lightgray'}
                    />
                    <ThemedText style={styles.inputNote}>Limits, restrictions, etc.</ThemedText>
                </View>
                <View style={styles.submitButtonContainer}>
                    {Platform.OS === 'web' ? (
                        <button style={styles.submitButton} onClick={submitDeal}>Submit</button>
                    ) : (
                        <Button title="Submit" color={Colors.shared.bobaOrange} onPress={submitDeal} />
                    )}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: Colors.light.background,
        display: 'flex',
    },
    formContainer: {
        display: 'flex',
        backgroundImage: `linear-gradient(to top, ${Colors.shared.bobaBrown}, 95%, ${Colors.shared.bobaBrownLight})`,
        padding: 40,
        width: '90%',
        margin: 'auto',
        marginTop: 120,
        borderRadius: 20,
        marginBottom: 40,
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 560,
    },
    dateInputContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '85%',
    },
    textInputContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '85%',
    },
    inputCol: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 110,
        width: '32%',
    },
    inputRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '46%',
    },
    textInput: {
        backgroundColor: 'white',  
        borderRadius: 10,
        padding: 6,
        paddingLeft: 12,
        fontFamily: 'CourierPrime',
        fontSize: 18,
    },
    notesInput: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 6,
        paddingLeft: 12,
        fontFamily: 'CourierPrime',
        fontSize: 18,
        marginTop: 8,
    },
    disabledTextInput: {
        backgroundColor: Colors.shared.bobaBrownLight,
        color: 'white',
        borderRadius: 10,
        padding: 6,
        paddingLeft: 12,
        fontFamily: 'CourierPrime',
        fontSize: 18,
        height: 46,
    },
    textInputRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    dateInputRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    picker: {
        width: 300,
        height: 50,
        fontFamily: 'CourierPrime',
        fontSize: 18,
        borderRadius: 10,
        borderColor: 'white',
        padding: 6,
        marginBottom: 10,
    },
    thinPicker: {
        height: 40,
        fontFamily: 'CourierPrime',
        fontSize: 18,
        borderRadius: 10,
        borderColor: 'white',
        padding: 6,
        marginBottom: 10,
    },
    inputNote: {
        marginTop: 10,
    },
    dateInput: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 6,
        paddingLeft: 12,
        fontFamily: 'CourierPrime',
        fontSize: 18,
        borderColor: 'white',
        boxShadow: 'none',
    },
    notesInputContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 20,
    },
    submitButtonContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButton: {
        marginTop: 10,
        backgroundColor: Colors.shared.bobaOrange,
        width: 200,
        fontFamily: 'LondrinaSolid',
        color: 'white',
        padding: 10,
        borderRadius: 10,
        fontSize: 24,
        borderColor: Colors.shared.bobaOrange,
        cursor: 'pointer',
    },
})