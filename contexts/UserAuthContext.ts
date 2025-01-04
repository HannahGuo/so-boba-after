import { User } from "firebase/auth"
import { createContext } from "react"

export const UserAuthContext = createContext<{
	user: User | null
	setUser: React.Dispatch<React.SetStateAction<User | null>>
}>({
	user: null,
	setUser: () => {},
})
