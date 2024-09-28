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
	token: z.string(),
	avatar: z.string(),
	banner: z.string()
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

export const editBotProfileSchema = z.object({
	botId: z.string(),
	username: z.string(),
	avatarData: z
		.object({
			data: z.string(),
			mimeType: z.string()
		})
		.optional(),
	bannerData: z
		.object({
			data: z.string(),
			mimeType: z.string()
		})
		.optional(),
	avatarForm: z
		.custom<File>()
		.refine((file) => file.size <= 8 * 1024 * 1024, {
			message: "File size too large. Max: 8MB"
		})
		.refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
			message: "Unsupported file type. Supported: PNG, JPEG"
		})
		.optional()
})

export const deleteAllCommandsSchema = z.object({
	botId: z.string()
})
