import Link from "next/link"
import { Separator } from "~/components/ui/separator"

export default function DashboardSidebar({ botId }: { botId: string }) {
	const links = {
		general: [
			{ text: "Manage Bot", href: `/dashboard/${botId}/manage` },
			{ text: "Invite Bot", href: `/dashboard/${botId}/invite` }
		]
	}

	return (
		<main className="pl-4 py-12 flex flex-col space-y-2 w-1/4">
			<p>General</p>
			<Separator className="w-full" />
			{links.general.map((object) => (
				<Link
					className="transition-all p-2 hover:bg-muted rounded-lg text-sm"
					key={object.text}
					href={object.href}
				>
					{object.text}
				</Link>
			))}
		</main>
	)
}
