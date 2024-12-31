import Header from "@/components/Header"
import { ThemedText } from "@/components/ThemedText"
import { Colors } from "@/constants/Colors"
import { Store } from "@/constants/types/Deals"
import { db, provider } from "@/firebase/app/firebaseConfig"
import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	User,
} from "firebase/auth"
import { collection, getDocs } from "firebase/firestore"
import React, { useEffect } from "react"
import { Button, ScrollView, StyleSheet, View } from "react-native"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import "react-tabs/style/react-tabs.css"
import AddBobaDeal from "./AddBobaDeal"
import AddStoreDeal from "./AddStoreDeal"

export default function Add() {
	const [tabIndex, setTabIndex] = React.useState(0)
	const [storesList, setStoresList] = React.useState<Store[]>([])
	const [isUserLoggedIn, setIsUserLoggedIn] = React.useState(false)
	const [user, setUser] = React.useState<User | null>(null)

	const auth = getAuth()

	function signInWithGoogle() {
		signInWithPopup(auth, provider).then((result) => {
			const credential = GoogleAuthProvider.credentialFromResult(result)
			const token = credential ? credential.accessToken : null
			const user = result.user
			if (user && token) {
				setIsUserLoggedIn(true)
				setUser(user)
			}
		})
	}

	function signOut() {
		auth.signOut().then(() => {
			setIsUserLoggedIn(false)
			setUser(null)
		})
	}

	useEffect(() => {
		const fetchData = async () => {
			const querySnapshot = await getDocs(collection(db, "stores"))
			const storesList = querySnapshot.docs.map((doc) => {
				const data = doc.data() as Store
				return { ...data, id: doc.id }
			})

			storesList.sort((a, b) => a.name.localeCompare(b.name))
			setStoresList(storesList)
		}
		document.title = "add boba deal"
		fetchData()
	}, [])

	return (
		<ScrollView style={styles.mainContainer}>
			<Header page="add" />
			<Tabs>
				<TabList style={styles.tabContainer}>
					<Tab
						style={{
							...styles.tabHeader,
							...(tabIndex === 0
								? {
										backgroundImage: `linear-gradient(to top, ${Colors.shared.bobaBrown}, 95%, ${Colors.shared.bobaBrownLight})`,
								  }
								: {
										backgroundImage: `linear-gradient(to top, ${Colors.shared.bobaBrownLight}, 95%, ${Colors.shared.bobaBrownLight})`,
								  }),
						}}
						onClick={() => setTabIndex(0)}
					>
						<ThemedText type="subtitle">Add Boba Deal</ThemedText>
					</Tab>
					<Tab
						style={{
							...styles.tabHeader,
							...(tabIndex === 1
								? {
										backgroundImage: `linear-gradient(to top, ${Colors.shared.bobaBrown}, 95%, ${Colors.shared.bobaBrownLight})`,
								  }
								: {
										backgroundImage: `linear-gradient(to top, ${Colors.shared.bobaBrownLight}, 95%, ${Colors.shared.bobaBrownLight})`,
								  }),
						}}
						onClick={() => setTabIndex(1)}
					>
						<ThemedText type="subtitle">Add Store Deal</ThemedText>
					</Tab>
				</TabList>

				<View style={styles.formContainer}>
					{isUserLoggedIn ? (
						<>
							<TabPanel>
								<ThemedText>
									<em>Signed in as {user?.displayName} </em>(
									<a
										href="#"
										onClick={signOut}
										style={{
											color: "white",
										}}
									>
										sign out
									</a>
									)
								</ThemedText>
								<View style={styles.dividerLine} />
								<AddBobaDeal storesList={storesList} />
							</TabPanel>
							<TabPanel>
								<ThemedText>
									<em>Signed in as {user?.displayName} </em>(
									<a
										href="#"
										onClick={signOut}
										style={{
											color: "white",
										}}
									>
										sign out
									</a>
									)
								</ThemedText>
								<View style={styles.dividerLine} />
								<AddStoreDeal storesList={storesList} />
							</TabPanel>
						</>
					) : (
						<>
							<Button
								title="Sign in with Google to add a deal"
								onPress={signInWithGoogle}
								color={Colors.shared.bobaBrownDark}
							/>
							<ThemedText style={{ marginTop: 20 }}>
								Note you must be to added to a Firebase rule in
								order to add a deal (so you won't be able to
								submit a deal despite this auth).
							</ThemedText>
						</>
					)}
				</View>
			</Tabs>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	mainContainer: {
		backgroundColor: Colors.light.background,
		display: "flex",
	},
	formContainer: {
		display: "flex",
		padding: 40,
		width: "90%",
		margin: "auto",
		borderTopLeftRadius: 0,
		borderTopRightRadius: 20,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
		marginBottom: 40,
		backgroundColor: Colors.shared.bobaBrown,
	},
	tabContainer: {
		borderBottomColor: "white",
		marginBottom: 0,
		marginTop: 120,
		marginLeft: "5%",
	},
	tabHeader: {
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderWidth: 0,
	},
	dividerLine: {
		borderBottomColor: "white",
		borderBottomWidth: StyleSheet.hairlineWidth,
		marginBottom: 10,
		marginTop: 10,
	},
})
