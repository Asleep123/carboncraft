import { PrismaAdapter } from "@lucia-auth/adapter-prisma"

import type { User as PrismaUser } from "@prisma/client"
import { Discord } from "arctic"
import { Lucia } from "lucia"
import type { Session, User } from "lucia"
import { cookies } from "next/headers"
import { cache } from "react"
import { env } from "~/env"
import { db } from "~/server/db"

const adapter = new PrismaAdapter(db.session, db.user)
export const discordAuth = new Discord(
	env.DISCORD_CLIENT_ID,
	env.DISCORD_CLIENT_SECRET,
	env.DISCORD_REDIRECT_URI
)

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		expires: false,
		attributes: {
			secure: process.env.NODE_ENV === "production"
		}
	},
	getUserAttributes: (data) => {
		return data
	},
	getSessionAttributes: (data) => {
		return data
	}
})

export const auth = cache(
	async (): Promise<
		{ user: User; session: Session } | { user: null; session: null }
	> => {
		const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null
		if (!sessionId) {
			return {
				user: null,
				session: null
			}
		}

		const result = await lucia.validateSession(sessionId)
		// next.js throws when you attempt to set cookie when rendering page
		try {
			if (result.session?.fresh) {
				const sessionCookie = lucia.createSessionCookie(
					result.session.id
				)
				cookies().set(
					sessionCookie.name,
					sessionCookie.value,
					sessionCookie.attributes
				)
			}
			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie()
				cookies().set(
					sessionCookie.name,
					sessionCookie.value,
					sessionCookie.attributes
				)
			}
		} catch {}
		return result
	}
)

export const validateRequest = cache(
	async (): Promise<
		{ user: User; session: Session } | { user: null; session: null }
	> => {
		const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null
		if (!sessionId) {
			return {
				user: null,
				session: null
			}
		}

		const result = await lucia.validateSession(sessionId)
		// next.js throws when you attempt to set cookie when rendering page
		try {
			if (result.session?.fresh) {
				const sessionCookie = lucia.createSessionCookie(
					result.session.id
				)
				cookies().set(
					sessionCookie.name,
					sessionCookie.value,
					sessionCookie.attributes
				)
			}
			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie()
				cookies().set(
					sessionCookie.name,
					sessionCookie.value,
					sessionCookie.attributes
				)
			}
		} catch {}
		return result
	}
)

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia
		DatabaseUserAttributes: DatabaseUserAttributes
		DatabaseSessionAttributes: DatabaseSessionAttributes
	}
}

interface DatabaseUserAttributes extends PrismaUser {}
interface DatabaseSessionAttributes {
	accessToken: string
}