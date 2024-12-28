import { z } from "zod"

export const commandSchema = z.object({
	name: z.string().max(20),
	description: z.string().max(64)
})

export const createCommandSchema = z.intersection(
	commandSchema,
	z.object({
		botId: z.string()
	})
)

export const botSchema = z.object({
	username: z.string(),
	publicKey: z.string(),
	token: z.string().length(59),
	avatar: z.string(),
	banner: z.string()
})

export const createBotSchema = z.object({
	token: z.string().length(59),
	publicKey: z.string().length(64)
})

export const registerCommandsSchema = z.object({
	botId: z.string(),
})

export const getBotSchema = z.object({
	botId: z.string()
})

export const editBotSchema = z.intersection(
	botSchema.partial(),
	z.object({
		botId: z.string()
	})
)

export const editBotProfileSchema = z.object({
	botId: z.string(),
	username: z.string(),
	avatarData: z
		.object({
			data: z.string().optional(),
			mimeType: z.string().optional()
		})
		.optional().nullable(),
	bannerData: z
		.object({
			data: z.string().optional(),
			mimeType: z.string().optional()
		})
		.optional().nullable(),
	avatarForm: z
		.custom<File>()
		.refine((file) => file.size <= 8 * 1024 * 1024, {
			message: "File size too large. Max: 8MB"
		})
		.refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
			message: "Unsupported file type. Supported: PNG, JPEG"
		})
		.optional(),
		bannerForm: z
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

export const saveCommandSchema = z.intersection(
	commandSchema,
	z.object({
		nodes: z.object({}).passthrough().optional(),
		edges: z.object({}).passthrough().optional()
	})
)