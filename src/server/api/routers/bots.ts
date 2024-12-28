import type { RESTGetAPICurrentUserResult } from "discord-api-types/v10"
import { db } from "~/server/db"
import {
	createBotSchema,
	editBotProfileSchema,
	editBotSchema,
	getBotSchema
} from "~/server/schemas"
import { discordConfig } from "../discordConfig"
import { encrypt, decrypt } from "~/lib/encryption"

import { TRPCError } from "@trpc/server"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"

export const botRouter = createTRPCRouter({
	// Create a bot
	create: protectedProcedure
		.input(createBotSchema)
		.mutation(async ({ input, ctx }) => {
			const request = await fetch(
				`${discordConfig.baseUrl}/${discordConfig.version}/users/@me`,
				{
					headers: {
						Authorization: `Bot ${input.token}`,
						"Content-Type": "application/json"
					}
				}
			)
			if (request.status === 401)
				return new TRPCError({ code: "BAD_REQUEST" })
			if (!request.ok) return new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
			const response =
				(await request.json()) as RESTGetAPICurrentUserResult

			return await db.bot.create({
				data: {
					username: response.username,
					publicKey: input.publicKey,
					clientId: response.id,
					token: encrypt(input.token),
					avatar: `${discordConfig.cdnUrl}/avatars/${response.id}/${response.avatar}`,
					owner: {
						connect: {
							id: ctx.user.id
						}
					}
				}
			})
		}),
	// Get a bot
	get: protectedProcedure
		.input(getBotSchema)
		.query(async ({ input, ctx }) => {
			return await db.bot.findFirst({
				where: {
					id: input.botId,
					ownerUserId: ctx.user.id
				}
			})
		}),
	// Decrypt a bot token
	getWithToken: protectedProcedure
		.input(getBotSchema)
		.query(async ({ input, ctx }) => {
			const bot = await db.bot.findFirst({
				where: {
					id: input.botId,
					ownerUserId: ctx.user.id
				}
			})
			const token = decrypt(bot ? bot.token : null)
			return {
				bot: bot,
				token: token
			}
		}),
	// Edit a bot
	edit: protectedProcedure
		.input(editBotSchema)
		.mutation(async ({ input, ctx }) => {
			const token = input.token ? encrypt(input.token) : undefined
			return await db.bot.update({
				where: {
					id: input.botId,
					ownerUserId: ctx.user.id
				},
				data: {
					token: token,
					publicKey: input.publicKey,
					avatar: input.avatar
				}
			})
		}),
	// Edit a bot's profile
	editProfile: protectedProcedure
		.input(editBotProfileSchema)
		.mutation(async ({ input, ctx }) => {
			const bot = await db.bot.findFirst({
				where: {
					id: input.botId,
					ownerUserId: ctx.user.id
				}
			})
			if (!bot) return new TRPCError({ code: "FORBIDDEN" })

			const body = JSON.stringify({
				username: input.username,
				avatar: (input.avatarData?.data ? `data:${input.avatarData.mimeType};base64,${input.avatarData.data}` : undefined),
				banner: (input.bannerData?.data ? `data:${input.bannerData.mimeType};base64,${input.bannerData.data}` : undefined)
			})

			const request = await fetch(
				`${discordConfig.baseUrl}/${discordConfig.version}/users/@me`,
				{
					method: "PATCH",
					headers: {
						"Authorization": `Bot ${bot.token}`,
						"Content-Type": "application/json"
					},
					body: body
				}
			)
			return await request.json()
		}),

		// Fetch all bots owned by a user
		getOwnedByUser: protectedProcedure
			.query(async ({ ctx }) => {
				return await db.bot.findMany({
					where: {
						ownerUserId: ctx.user.id
					},
					omit: {
						token: true
					}
				})
			})
})
