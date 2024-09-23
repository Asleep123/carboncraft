import { cookies } from "next/headers"
import { auth, discordAuth, lucia } from "~/server/auth"

import { OAuth2RequestError } from "arctic"
import type { APIUser } from "discord-api-types/v10"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"
import { db } from "~/server/db"

export const GET = async (request: NextRequest) => {
	const { user } = await auth()
	if (user) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		})
	}
	const cookieStore = cookies()
	const storedState = cookieStore.get("discord_oauth_state")?.value
	const url = new URL(request.url)
	const state = url.searchParams.get("state")
	const code = url.searchParams.get("code")
	// validate state
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		})
	}
	try {
		const tokens = await discordAuth.validateAuthorizationCode(code)
		const response = await fetch(`https://discord.com/api/v10/users/@me`, {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		})
		const discordUser = (await response.json()) as APIUser

		const redirect = cookieStore.get("auth_redirect")?.value
		cookieStore.delete("auth_redirect")

		const avatarUrl = `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`

		const dbUser = await db.user.upsert({
			where: {
				id: discordUser.id
			},
			update: {
				username: discordUser.username,
				avatar: avatarUrl,
				lastWebLogin: new Date()
			},
			create: {
				id: discordUser.id,
				username: discordUser.username,
				avatar: avatarUrl,
				lastWebLogin: new Date()
			}
		})


		const session = await lucia.createSession(dbUser.id, {
			accessToken: tokens.accessToken
		})
		const sessionCookie = lucia.createSessionCookie(session.id)
		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes
		)
		return new Response(null, {
			status: 302,
			headers: {
				Location: redirect ?? "/"
			}
		})
	} catch (e) {
		if (
			e instanceof OAuth2RequestError &&
			e.message === "bad_verification_code"
		) {
			// invalid code
			return new Response(null, {
				status: 400
			})
		}
		if (e instanceof OAuth2RequestError && e.message === "invalid_grant") {
			redirect("/api/auth/login?redirect=/&force=true")
		}
		console.error(e)
		return new Response(null, {
			status: 500
		})
	}
}