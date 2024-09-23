import type { RESTGetAPICurrentUserResult } from "discord-api-types/v10"
import { db } from "~/server/db"
import { createBotSchema, editBotSchema, getBotSchema } from "~/server/schemas"
import { discordConfig } from "../discordConfig"

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
			const response =
				(await request.json()) as RESTGetAPICurrentUserResult

			return await db.bot.create({
				data: {
					...input,
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
	// Edit a bot
	edit: protectedProcedure
		.input(editBotSchema)
		.mutation(async ({ input, ctx }) => {
			return await db.bot.update({
				where: {
					id: input.botId,
					ownerUserId: ctx.user.id
				},
				data: {
					token: input.token,
					publicKey: input.publicKey
				}
			})
		})
})
