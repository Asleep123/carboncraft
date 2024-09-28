import Link from "next/link"
import { Settings } from "lucide-react"
import { UserPlus } from "lucide-react"


export default function DashboardSidebar({ botId }: { botId: string }) {
	const links = {
		general: [
			{ text: "Manage Bot", href: `/dashboard/${botId}/manage`, icon: <Settings /> },
			{ text: "Invite Bot", href: `/dashboard/${botId}/invite`, icon: <UserPlus /> }
		]
	}

	return (
		<main className="w-64 min-h-screen flex-shrink-0 flex-col border-r bg-background">
			<nav className="flex h-full flex-col items-start gap-4 py-5">
				<p className="text-sm px-6">General</p>
				<div className="flex-1 space-y-2 px-6">
					{links.general.map((object) => (
						<Link href={object.href} key={object.text} className="flex items-center gap-4 rounded-md px-4 py-3 text-muted-foreground transition-colos hover:bg-accent hover:text-accent-foreground">
							{object.icon}
							<span>{object.text}</span>
						</Link>
					))}
				</div>
			</nav>
		</main>
	)
}
