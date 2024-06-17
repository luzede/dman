import { Events } from "discord.js";
import type { Interaction, Collection } from "discord.js/typings";
import type { Event } from "../events/types";
import type { Command } from "../commands/types";
import type { Database } from "../database/types/database";
import type { Kysely } from "kysely";

const interactionCreate: Event = {
	name: Events.InteractionCreate,
	once: false,
	async execute(
		interaction: Interaction,
		commands: Collection<string, Command>,
		db: Kysely<Database>,
	) {
		/*___________________________________________________________
    __ChatInputCommandInteraction________________________________
    _____________________________________________________________*/
		if (interaction.isChatInputCommand()) {
			const command = commands.get(interaction.commandName);

			if (!command) {
				console.error(
					`No command matching ${interaction.commandName} was found.`,
				);
				return;
			}

			try {
				await command.execute(interaction, db);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({
						content: "There was an error while executing this command!",
					});
				} else {
					await interaction.reply({
						content: "There was an error while executing this command!",
						ephemeral: true,
					});
				}
			}
		}
	},
};

export default interactionCreate;
