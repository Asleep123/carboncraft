import type { Session } from "@prisma/client"
import { ModeToggle } from "./ThemeToggle"

export default function Navbar({ session }: { session: Session | null }) {
	return (
		<nav className="w-full h-[4rem] bg-background border-b flex items-center justify-between">
			<div className="flex items-center justify-between pl-8">
				<span>CarbonCraft</span>
			</div>
			<div className="flex items-center justify-between space-x-8 pr-8">
				<p>Home</p>
				<p>About</p>
				<p>Docs</p>
				{session ? <p>Logged in</p> : <p>Unauthenticated</p>}
				<ModeToggle />
			</div>
		</nav>
	)
}
