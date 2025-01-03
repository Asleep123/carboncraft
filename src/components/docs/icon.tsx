import type { LucideIcon } from "lucide-react"
import { FileTextIcon } from "lucide-react"
import type { ReactElement } from "react"

export function create({
	icon: Icon
}: {
	icon?: LucideIcon
}): ReactElement {
	return (
		<div className="rounded-md border bg-gradient-to-b from-fd-secondary p-1 shadow-sm">
			{Icon ? <Icon /> : <FileTextIcon />}
		</div>
	)
}
