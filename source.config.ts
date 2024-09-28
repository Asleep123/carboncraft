import {
	defineConfig,
	defineDocs,
	frontmatterSchema,
	metaSchema
} from "fumadocs-mdx/config"
import { z } from "zod"

export const { docs, meta } = defineDocs({
	docs: {
		dir: "src/docs/content",
		schema: frontmatterSchema.extend({
			index: z.boolean().default(false)
		})
	},
	meta: {
		dir: "src/docs/content",
		schema: metaSchema
	}
})

export default defineConfig({
	generateManifest: true,
	lastModifiedTime: "git"
})
