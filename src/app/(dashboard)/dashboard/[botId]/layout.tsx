"use client"

import type * as React from "react"
import DashboardSidebar from "~/components/DashboardSidebar"

export default function RootLayout({
	children,
	params
}: { children: React.ReactNode; params: { botId: string } }) {
	return (
		<main className="flex min-h-screen">
			<DashboardSidebar botId={params.botId} />
			<main className="flex-1 overflow-auto">{children}</main>
		</main>
	)
}
