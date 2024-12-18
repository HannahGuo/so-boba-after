import DealsList from "@/components/DealsList";
import Header from "@/components/Header";
import { Colors } from "@/constants/Colors";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

export default function Home() {
    useEffect(() => {
      document.title = "...so, boba after?";
    }, []);

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