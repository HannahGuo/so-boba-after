import Header from "@/components/Header";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { db } from "@/firebase/app/firebaseConfig";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, Platform, StyleSheet, TextInput, View } from "react-native";

function makeDrinkHolderPlaceholder(drinkNumber: number, dealType: BobaDealType | undefined) {
    if (dealType === 'single' && drinkNumber > 1) {
        return 'Only one drink for single deals';
    }

    if (dealType === 'bogo' && drinkNumber === 3) {
        return 'Only two drinks for bogo';
    }

    return `Drink Name`;
}

export default function Add() {
    const [storeName, setStoreName] = useState<string>();
    const [dealType, setDealType] = useState<BobaDealType>('single');
    
    const [drinkNameOne, setDrinkNameOne] = useState<string>();
    const [drinkNameTwo, setDrinkNameTwo] = useState<string>();
    const [drinkNameThree, setDrinkNameThree] = useState<string>();

    const allowDrinkTwo = dealType !== 'single';
    const allowDrinkThree = dealType !== 'single' && dealType !== 'bogo';

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());

    const [notes, setNotes] = useState<string>();

    const [storesList, setStoresList] = useState<Store[]>([]);

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
        <View style={styles.mainContainer}>
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
                        <TextInput
                            style={styles.textInput}
                            placeholder={makeDrinkHolderPlaceholder(1, dealType)}
                            value={drinkNameOne}
                            onChangeText={setDrinkNameOne}
                            placeholderTextColor={'lightgray'}
                        />
                        <TextInput
                            style={{...(!allowDrinkTwo ? styles.disabledTextInput : styles.textInput)}}
                            placeholder={makeDrinkHolderPlaceholder(2, dealType)}
                            value={drinkNameTwo}
                            onChangeText={setDrinkNameTwo}
                            editable={allowDrinkTwo}
                            placeholderTextColor={!allowDrinkTwo ? 'white' : 'lightgray'}
                        />
                        <TextInput
                            style={{...(!allowDrinkThree ? styles.disabledTextInput : styles.textInput)}}
                            placeholder={makeDrinkHolderPlaceholder(3, dealType)}
                            value={drinkNameThree}
                            onChangeText={setDrinkNameThree}
                            editable={allowDrinkThree}
                            placeholderTextColor={!allowDrinkThree ? 'white' : 'lightgray'}
                        />
                    </View>
                    <ThemedText style={styles.inputNote}>If the deal is for “one of XYZ” input all drinks in one box.</ThemedText>
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
                    <ThemedText style={styles.inputNote}>Limits, conditions, etc.</ThemedText>
                </View>
                
                <View style={styles.submitButtonContainer}>
                    {Platform.OS === 'web' ? (
                        <button style={styles.submitButton} onClick={() => console.log('submit')}>Submit</button>
                    ) : (
                        <Button title="Submit" color={Colors.shared.bobaOrange} onPress={() => console.log('submit')} />
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        height: '100%',
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
        width: '55%',
    },
    textInputContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '80%',
    },
    textInput: {
        backgroundColor: 'white',  
        borderRadius: 10,
        padding: 6,
        paddingLeft: 12,
        fontFamily: 'CourierPrime',
        fontSize: 18,
        width: '32%',
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
        width: '32%',
    },
    textInputRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
        height: 50,
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