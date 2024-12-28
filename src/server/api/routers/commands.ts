import { TRPCError } from "@trpc/server"
import { db } from "~/server/db"
import {
	createCommandSchema,
	deleteAllCommandsSchema,
	registerCommandsSchema,
	saveCommandSchema
} from "~/server/schemas"
import { discordConfig } from "../discordConfig"

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { decrypt } from "~/lib/encryption"

export const commandRouter = createTRPCRouter({
	// Create a command
	create: protectedProcedure
		.input(createCommandSchema)
		.mutation(async ({ input, ctx }) => {
			return await db.bot.update({
				where: {
					ownerUserId: ctx.user.id,
					id: input.botId
				},
				data: {
					commands: {
						create: {
							name: input.name,
							description: input.description
						}
					}
				}
			})
		}),
	// Register commands to Discord API
	register: protectedProcedure
		.input(registerCommandsSchema)
		.mutation(async ({ input, ctx }) => {
			const bot = await db.bot.findFirst({
				where: {
					id: input.botId,
					ownerUserId: ctx.user.id
				},
				select: {
					commands: {
						select: {
							name: true,
							description: true
						}
					},
					token: true,
					clientId: true
				}
			})
			if (!bot) return

			const request = await fetch(
				`${discordConfig.baseUrl}/${discordConfig.version}/applications/${bot.clientId}/commands`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bot ${decrypt(bot.token)}`
					},
					body: JSON.stringify(bot.commands)
				}
			)

			if (request.status === 400)
				return new TRPCError({ code: "BAD_REQUEST" })
			if (request.status === 401)
				return new TRPCError({ code: "UNAUTHORIZED" })
			return await request.json()
		}),
	// Delete all commands
	deleteAll: protectedProcedure
		.input(deleteAllCommandsSchema)
		.mutation(async ({ input, ctx }) => {
			const bot = await db.bot.findFirst({
				where: {
					id: input.botId,
					ownerUserId: ctx.user.id
				}
			})
			if (!bot) return new TRPCError({ code: "UNAUTHORIZED" })

			const request = await fetch(
				`${discordConfig.baseUrl}/${discordConfig.version}/applications/${bot.clientId}/commands`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: bot.token
					},
					body: JSON.stringify([])
				}
			)
			if (request.status === 401)
				return new TRPCError({ code: "UNAUTHORIZED" })
			return
		}),
	// Save a command's contents
	save: protectedProcedure
	.input(saveCommandSchema)
	.mutation(async ({ input, ctx }) => {})
})
