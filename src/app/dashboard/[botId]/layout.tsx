"use client"

import type * as React from "react"
import DashboardSidebar from "~/components/DashboardSidebar"

export default function RootLayout({
	children,
	params
}: { children: React.ReactNode; params: { botId: string } }) {
	return (
		<main className="flex space-x-4">
			<DashboardSidebar botId={params.botId} />
			{children}
		</main>
	)
}
