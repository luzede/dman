import { SlashCommandBuilder } from "discord.js";
// import { sql } from "kysely";
import type { ChatInputCommandInteraction } from "discord.js/typings";
import type { Kysely } from "kysely";
import type { Database } from "../database/types/database";

export default {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with pong!"),

	async execute(
		interaction: ChatInputCommandInteraction,
		_db: Kysely<Database>,
	) {
		await interaction.reply({ content: "Pong!", ephemeral: true });
	},
};
