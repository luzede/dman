import {
	deleteBannedRecordsByBanEndsAtUntil,
	getBannedRecordsByBanEndsAtUntil,
} from "../database/queries/banned";
import type { Kysely } from "kysely";
import type { Client } from "discord.js/typings";
import type { Database } from "../database/types";
import { SqliteError } from "better-sqlite3";

export async function unbanAfterBanEnds(client: Client, db: Kysely<Database>) {
	const date_now = new Date().toISOString().replace("T", " ").slice(0, 19);
	const date_yesterday = new Date(Date.now() - 86400000)
		.toISOString()
		.replace("T", " ")
		.slice(0, 19);

	try {
		const bannedRecords = await getBannedRecordsByBanEndsAtUntil(db, date_now);

		// Delete banned records that have ban_ends_at <= date_1_day_ago
		// So that the ban handler can count the bans in the last 24 hours correctly
		// To limit the number of bans a user can make in the last 24 hours
		// It does this by checking the number of records in the last 24 hours
		// and if the number of records is greater than or equal to 3, it stops the ban process
		// This is to prevent abuse of the ban command
		// read the code at "src/commands/ban.ts"
		await deleteBannedRecordsByBanEndsAtUntil(db, date_yesterday);

		for (const { user_id, guild_id } of bannedRecords) {
			const guild = await client.guilds.fetch(guild_id);

			// If the guild is not found, log the message and continue to the next iteration
			if (!guild) {
				console.log(
					`Guild with ID ${guild_id} not found, either the bot is not in the guild or the guild was deleted`,
				);
				continue;
			}

			// Returns "User" or "null", or void if the catch statement does not return null;
			await guild.bans.remove(user_id).catch((_error) => {
				console.log(
					"Error while unbanning the user.\nThe user might have been unbanned manually, automatically or no longer exists.",
				);
				// console.error(_error);
				// return null;
			});
		}
	} catch (error) {
		console.error("--------------------------------------------");
		console.error(
			"Error while unbanning the user in 'src/service/unban_after_ban_duration.ts'",
		);
		if (error instanceof SqliteError) console.error(error.code);
		else
			console.error(
				"Unknown error in 'src/service/unban_after_ban_duration.ts'\n",
				error,
			);
		console.error("--------------------------------------------");
	}

	// Run the function every 10 minutes
	// 1 hour = 3600000 ms
	setTimeout(unbanAfterBanEnds, 1000 * 30, client, db);
}
