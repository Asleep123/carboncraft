import { Client, ClientMode } from "@buape/carbon"
import { db } from "~/server/db"
import CommandHandler from "~/server/discord/handler"

export async function POST(request: Request) {
	const body = await request.clone().json()
	if (!body.application_id) return new Response(null, { status: 400 })
	const bot = await db.bot.findFirst({
		where: {
			clientId: body.application_id
		}
	})
	if (!bot) return new Response(null, { status: 401 })

	const client = new Client(
		{
			clientId: bot.clientId,
			publicKey: bot.publicKey,
			token: bot.token,
			mode: ClientMode.NodeJS
		},
		[new CommandHandler()]
	)
	return client.handle(request)
}
