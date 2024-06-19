import { Events } from "discord.js";
import { DiscordAPIError } from "discord.js";
import type { Interaction, Collection } from "discord.js/typings";
import type { Event } from "../events/types";
import type { Command } from "../commands/types";
import type { Database } from "../database/types/database";
import type { Kysely } from "kysely";

const DEBUG_MODE = process.env?.DEBUG_MODE;

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
				if (DEBUG_MODE) {
					console.error("--------------------------------------------");
					console.error(
						`Error while executing command "${interaction.commandName}"`,
					);
					if (error instanceof DiscordAPIError) {
						console.error(error.code);
						console.error(error.message);
						console.error(error.cause);
						console.error(error.stack);
					} else
						console.error(
							"Unknown error in 'src/events/interactionCreate.ts'\n",
							error,
						);
					console.error("--------------------------------------------");
				}
			}
		}
	},
};

export default interactionCreate;
