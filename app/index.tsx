import DealsList from "@/components/DealsList";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import { ImageBackground, StyleSheet, View } from "react-native";

export default function Home() {
    return (
        <View style={styles.mainContainer}>
        <ImageBackground source={require('../assets/images/bobaHeader.svg')} style={styles.headerImage}/>
        <View style={styles.titleContainer}>
          <ThemedText type='title'>...so boba after?</ThemedText>
          <Link href="/add">
            <ThemedText>Add a deal</ThemedText>
          </Link>
        </View>
        <DealsList/>
      </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
      height: '100%',
      backgroundColor: Colors.light.background,
      display: 'flex',
    },
    titleContainer: {
      marginTop: 10,
      marginLeft: 20,
    },
    headerImage: {
      position: 'absolute',
      top: -40,
      left: -20,
    }
  });