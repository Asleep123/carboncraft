"use server";

import { api } from "~/trpc/server";
import ManageContent from "./ManageContent";
import { notFound } from "next/navigation";

export default async function Dashboard({ params }: { params: { botId: string } }) {
    const bot = await api.bots.get.query({ botId: params.botId })
	if (!bot) return notFound()

	return <ManageContent bot={bot} />
}