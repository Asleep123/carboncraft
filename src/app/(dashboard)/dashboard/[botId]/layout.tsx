"use client"

import type * as React from "react"
import DashboardSidebar from "~/components/DashboardSidebar"

export default function RootLayout({
	children,
	params
}: { children: React.ReactNode; params: { botId: string } }) {
	return (
		<main className="flex h-[calc(100vh-4rem)] overflow-hidden">
			<DashboardSidebar botId={params.botId} />
			<main className="flex-1 flex flex-col">
				{children}
			</main>
		</main>
	)
}
