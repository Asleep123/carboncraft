import { z } from "zod"

export const createCommandSchema = z.object({
	botId: z.string(),
	name: z.string(),
	description: z.string()
})

export const createBotSchema = z.object({
	username: z.string(),
	clientId: z.string(),
	publicKey: z.string(),
	token: z.string()
})

export const registerCommandsSchema = z.object({
	clientId: z.string(),
	botToken: z.string()
})

export const getBotSchema = z.object({
	botId: z.string()
})

export const editBotSchema = z.intersection(
	createBotSchema.partial(),
	z.object({
		botId: z.string()
	})
)

export const deleteAllCommandsSchema = z.object({
	botId: z.string()
})
