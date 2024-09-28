import type { InferMetaType, InferPageType } from "fumadocs-core/source"
import { loader } from "fumadocs-core/source"
import { createMDXSource } from "fumadocs-mdx"
import { icons } from "lucide-react"
import { create } from "~/components/docs/icon"
import { docs, meta } from ".source"

export const source = loader({
	baseUrl: "/docs",
	icon(icon) {
		if (icon && icon in icons)
			return create({ icon: icons[icon as keyof typeof icons] })
	},
	source: createMDXSource(docs, meta)
})

export type Page = InferPageType<typeof source>
export type Meta = InferMetaType<typeof source>
