import * as context from "next/headers"
import { auth, discordAuth, lucia } from "~/server/auth"

import { generateState } from "arctic"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

export const GET = async (request: NextRequest) => {
	const { session } = await auth()
	if (session) {
		await lucia.invalidateSession(session.id)
		const sessionCookie = lucia.createBlankSessionCookie()
		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes
		)
	}
	const state = generateState()
	const thisUrl = new URL(request.url)
	const force = thisUrl.searchParams.get("force") === "true" || false
	const url = `${await discordAuth.createAuthorizationURL(state, {
		scopes: ["identify", "guilds", "connections"]
	})}&prompt=${force ? "consent" : "none"}`
	const cookieStore = context.cookies()
	cookieStore.set("discord_oauth_state", state, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: 60 * 60
	})

	const redirect = thisUrl.searchParams.get("redirect") || "/"
	cookieStore.set("auth_redirect", redirect, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: 60 * 60
	})

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	})
}
