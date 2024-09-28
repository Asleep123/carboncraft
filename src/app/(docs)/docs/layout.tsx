import { DocsLayout } from "fumadocs-ui/layout"
import type { ReactNode } from "react"
import { baseOptions } from "~/app/(docs)/layout.config"
import { source } from "../source"

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<DocsLayout tree={source.pageTree} {...baseOptions}>
			{children}
		</DocsLayout>
	)
}
