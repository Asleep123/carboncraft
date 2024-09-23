import type { Session } from "@prisma/client"

export default function Navbar({ session }: { session: Session | null }) {
    return (
        <nav className="w-full flex justify-between p-4">
            <p>CarbonCraft</p>
            <div className="flex justify-between space-x-6">
                <p>Home</p>
                <p>About</p>
                <p>Docs</p>
                {session ? <p>Logged in</p> : <p>Unauthenticated</p>}
            </div>
        </nav>
    )
}