"use server"

import { notFound } from "next/navigation"
import { api } from "~/trpc/server"
import ManageContent from "./ManageContent"
import { redirect } from "next/navigation"

export default async function Dashboard({
	params
}: { params: { botId: string } }) {
	const bot = await api.bots.get.query({ botId: params.botId }).catch(() => { return redirect("/api/auth/login") })
	if (!bot) return notFound()

	return <ManageContent bot={bot} />
}
