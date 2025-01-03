"use server"

import { notFound } from "next/navigation"
import { redirect } from "next/navigation"
import { api } from "~/trpc/server"
import ManageContent from "./ManageContent"

export default async function Dashboard({
	params
}: { params: { botId: string } }) {
	const bot = await api.bots.getWithToken.query({ botId: params.botId }).catch(() => {
		return redirect("/api/auth/login")
	})
	if (!bot.bot || !bot.token) return notFound()

	return <ManageContent bot={{ bot: bot.bot, token: bot.token }} />
}
