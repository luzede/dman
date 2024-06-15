import type {
	SlashCommandBuilder,
	Interaction,
	Collection,
} from "discord.js/typings";
import type { Kysely } from "kysely";
import type { Database } from "../../database/types/database";

export interface Command {
	data: SlashCommandBuilder;
	execute(
		interaction: Interaction,
		commands?: Collection<string, Command>,
		db?: Kysely<Database>,
	): Promise<void>;
}
