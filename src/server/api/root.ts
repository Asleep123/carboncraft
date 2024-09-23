import { botRouter } from "~/server/api/routers/bots"
import { commandRouter } from "~/server/api/routers/commands"
import { createTRPCRouter } from "~/server/api/trpc"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	bots: botRouter,
	commands: commandRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
