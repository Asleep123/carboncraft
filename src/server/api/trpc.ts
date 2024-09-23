import { TRPCError, initTRPC } from "@trpc/server"
import superjson from "superjson"
import { ZodError } from "zod"

import type { Session, User } from "lucia"

export const createTRPCContext = async ({
	session,
	user
}: {
	session: Session | null
	user: User | null
}) => {
	return {
		session,
		user
	}
}

const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.cause instanceof ZodError
						? error.cause.flatten()
						: null
			}
		}
	}
})

export const createTRPCRouter = t.router

export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.session || !ctx.user) {
		throw new TRPCError({ code: "UNAUTHORIZED" })
	}
	return next({
		ctx: {
			session: ctx.session,
			user: ctx.user
		}
	})
})