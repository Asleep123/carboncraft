import { createCommandSchema, registerCommandsSchema, deleteAllCommandsSchema } from "~/server/schemas";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { discordConfig } from "../discordConfig";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
        const commands = await db.command.findMany({
            where: {
                botClientId: input.clientId,
                bot: {
                    ownerUserId: ctx.user.id
                }
            },
            select: {
                name: true,
                description: true
            }
        })

        const request = await fetch(`${discordConfig.baseUrl}/${discordConfig.version}/applications/${input.clientId}/commands`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bot ${input.botToken}`
            },
            body: JSON.stringify(commands)
        })

        if (request.status === 400) return new TRPCError({"code": "BAD_REQUEST"})
        if (request.status === 401) return new TRPCError({"code": "UNAUTHORIZED"})
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
        if (!bot) return new TRPCError({"code": "UNAUTHORIZED"})

        const request = await fetch(`${discordConfig.baseUrl}/${discordConfig.version}/applications/${bot.clientId}/commands`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": bot.token
            },
            body: JSON.stringify([])
        })
        if (request.status === 401) return new TRPCError({"code": "UNAUTHORIZED"})
        return
    })
})