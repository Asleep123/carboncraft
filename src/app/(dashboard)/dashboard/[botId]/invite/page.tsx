"use server"

import { notFound } from "next/navigation"
import { redirect } from "next/navigation"
import { api } from "~/trpc/server"
import InviteContent from "./InviteContent"

export default async function Dashboard({
	params
}: { params: { botId: string } }) {
	const bot = await api.bots.get.query({ botId: params.botId }).catch(() => {
		return redirect("/api/auth/login")
	})
	if (!bot) return notFound()

	return <InviteContent bot={bot} />
}
