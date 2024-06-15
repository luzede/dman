import { SlashCommandBuilder } from "discord.js";
// import { sql } from "kysely";
import type {
	ChatInputCommandInteraction,
	Collection,
} from "discord.js/typings";
import type { Kysely } from "kysely";
import type { Command } from "../commands/types";
import type { Database } from "../database/types/database";

export default {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with pong!"),

	async execute(
		interaction: ChatInputCommandInteraction,
		_commands: Collection<string, Command>,
		_db: Kysely<Database>,
	) {
		await interaction.reply({ content: "Pong!", ephemeral: true });

		// await db
		// 	.insertInto("banned")
		// 	.values({
		// 		user_id: "123",
		// 		reason: "Spamming",
		// 		guild_id: "456",
		// 		ban_duration_minutes: 60,
		// 	})
		// 	.execute();

		// const banned = await db.selectFrom("banned").selectAll().execute();
		// console.log(banned);

		// const res = await sql`SELECT 5 as five`.execute(db);
		// console.log(res);
	},
};
