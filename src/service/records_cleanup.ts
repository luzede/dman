import { SqliteError } from "better-sqlite3";
import { deleteMutedRecordsByCreatedAtUntil } from "../database/queries/muted";
import type { Database } from "../database/types";
import type { Kysely } from "kysely";

export async function recordsCleanup(db: Kysely<Database>) {
	// subtract a year from the current date
	const date_year_before = new Date(Date.now() - 31536000000)
		.toISOString()
		.slice(0, 10);

	const response = await deleteMutedRecordsByCreatedAtUntil(
		db,
		date_year_before,
	).catch((err) => {
		console.error("--------------------------------------------");
		console.log(
			"Error while deleting records from table 'muted' in 'src/service/records_cleanup.ts'",
		);
		if (err instanceof SqliteError) console.error(err.code);
		else
			console.error("Unknown error in 'src/service/records_cleanup.ts'\n", err);
		console.error("--------------------------------------------");
		return undefined;
	});

	if (response) {
		console.log(
			`Deleted ${response[0].numDeletedRows} records from table 'muted'`,
		);
	}

	setTimeout(recordsCleanup, 1000 * 60, db);
}
