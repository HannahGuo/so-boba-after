import { Link } from "expo-router";
import { ImageBackground, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

type HeaderPage = 'home' | 'add';

export default function Header({ page }: { page: HeaderPage }) {
    return <View style={styles.headerContainer}>
            <ImageBackground source={require('../assets/images/bobaHeaderLeft.svg')} style={styles.headerImageLeft}/>
            <View style={styles.titleContainer}>
                <ThemedText type='title'>...so boba after?</ThemedText>
            </View>
            <ImageBackground source={require('../assets/images/bobaHeaderRight.svg')} style={styles.headerImageRight}/>

            {page === 'home' &&
                <View style={styles.addDealContainer}>
                    <Link href="/add">
                        <ThemedText>Add a deal [+]</ThemedText>
                    </Link>
                </View>
            }
    </View>
}

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%'
    },
    titleContainer: {
      marginTop: 10,
      marginLeft: 20,
    },
    headerImageLeft: {
      position: 'absolute',
      top: -40,
      left: -20,
    },
    headerImageRight: {
        position: 'absolute',
        top: -20,
        left: '68%'
    },
    addDealContainer: {
        position: 'absolute',
        top: 26,
        left: '69.5%',
    }
});