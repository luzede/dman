import type {
	SlashCommandBuilder,
	Interaction,
	SlashCommandOptionsOnlyBuilder,
	SlashCommandSubcommandBuilder,
	SlashCommandMentionableOption,
} from "discord.js/typings";
import type { Kysely } from "kysely";
import type { Database } from "../../database/types/database";

export interface Command {
	data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
	execute(interaction: Interaction, db?: Kysely<Database>): Promise<void>;
}
