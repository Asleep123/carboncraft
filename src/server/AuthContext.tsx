"use client"

import { type PropsWithChildren, createContext, useContext } from "react"
import type { validateRequest } from "./auth"

type ContextType = Awaited<ReturnType<typeof validateRequest>>

const SessionContext = createContext<ContextType>({
	session: null,
	user: null
})

export const useAuth = () => useContext(SessionContext)

export const AuthProvider = ({
	children,
	value
}: PropsWithChildren<{ value: ContextType }>) => {
	return (
		<SessionContext.Provider value={value}>
			{children}
		</SessionContext.Provider>
	)
}
