import { SqliteError } from "better-sqlite3";
import { deleteMutedRecordsByCreatedAtUntil } from "../database/queries/muted";
import { DiscordAPIError } from "discord.js";
import type { Database } from "../database/types";
import type { Kysely } from "kysely";

const DEBUG_MODE = process.env?.DEBUG_MODE;

export async function recordsCleanup(db: Kysely<Database>) {
	// subtract a year from the current date
	const date_year_before = new Date(Date.now()- 31536000000)
		.toISOString()
		.replace("T", " ")
		.slice(0, 19);

	const response = await deleteMutedRecordsByCreatedAtUntil(
		db,
		date_year_before,
	).catch((err) => {
		if (!DEBUG_MODE) return undefined;
		console.error("--------------------------------------------");
		console.log(
			"Error while deleting records from table 'muted' in 'src/service/records_cleanup.ts'",
		);
		if (err instanceof SqliteError) console.error(err.code);
		else if (err instanceof DiscordAPIError)
			console.error(
				err.code,
				"\n",
				err.message,
				"\n",
				err.cause,
				"\n",
				err.stack,
			);
		else
			console.error("Unknown error in 'src/service/records_cleanup.ts'\n", err);
		console.error("--------------------------------------------");
		return undefined;
	});

	if (response && DEBUG_MODE) {
		console.log(
			`Deleted ${response[0].numDeletedRows} records from table 'muted'`,
		);
	}

	setTimeout(recordsCleanup, 86400000, db);
}
