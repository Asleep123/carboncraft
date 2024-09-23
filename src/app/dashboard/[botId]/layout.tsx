"use client"

import DashboardSidebar from "~/components/DashboardSidebar"
import type * as React from "react"

export default function RootLayout({ children, params }: { children: React.ReactNode, params: { botId: string } }) {

        return (
        <main className="flex space-x-4">
            <DashboardSidebar botId={params.botId} />
            {children}
        </main>
    )
  }