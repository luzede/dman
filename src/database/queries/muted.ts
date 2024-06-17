import type { Database, NewMute } from "../../database/types";
import type { Kysely } from "kysely";

export function insertNewMuteRecord(
	db: Kysely<Database>,
	new_mute_record: NewMute,
) {
	return db.insertInto("muted").values(new_mute_record).execute();
}

export function getMutedRecords(db: Kysely<Database>) {
	return db.selectFrom("muted").selectAll().execute();
}

export function deleteMutedRecordsByMuteEndsAtUntil(
	db: Kysely<Database>,
	date: string,
) {
	return db
		.deleteFrom("muted")
		.where("muted.mute_ends_at", "<", date)
		.execute();
}

export function deleteMutedRecordsByCreatedAtUntil(
	db: Kysely<Database>,
	date: string,
) {
	return db.deleteFrom("muted").where("muted.created_at", "<", date).execute();
}
