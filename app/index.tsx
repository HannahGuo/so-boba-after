import DealsList from "@/components/DealsList";
import Header from "@/components/Header";
import { Colors } from "@/constants/Colors";
import { StyleSheet, View } from "react-native";

export default function Home() {
    return (
        <View style={styles.mainContainer}>
        <Header page="home"/>
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
  });