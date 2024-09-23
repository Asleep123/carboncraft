import { Command, type CommandInteraction } from "@buape/carbon";
import { db } from "~/server/db";

export default class CommandHandler extends Command {
    name = "*"
    description = "CarbonCraft Command Handler"
    defer = true

    async run(interaction: CommandInteraction) {
        const command = await db.command.findFirst({
            where: {
                botClientId: interaction.client.options.clientId,
                name: interaction.rawData.data.name
            }
        })
        return interaction.reply({
            content: command?.id
        })
    }
}