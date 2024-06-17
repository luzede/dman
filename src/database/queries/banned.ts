import type { Database, NewBan } from "../../database/types";
import type { Kysely } from "kysely";

export function getBannedRecords(db: Kysely<Database>) {
	return db.selectFrom("banned").selectAll().execute();
}

export function getBannedRecordsByBanEndsAtUntil(
	db: Kysely<Database>,
	date: string,
) {
	return db
		.selectFrom("banned")
		.selectAll()
		.where("banned.ban_ends_at", "<=", date)
		.execute();
}

export function deleteBannedRecordsByBanEndsAtUntil(
	db: Kysely<Database>,
	date: string,
) {
	return db
		.deleteFrom("banned")
		.where("banned.ban_ends_at", "<=", date)
		.execute();
}

export function deleteBannedRecordsByCreatedAtUntil(
	db: Kysely<Database>,
	date: string,
) {
	return db
		.deleteFrom("banned")
		.where("banned.created_at", "<=", date)
		.execute();
}

export function banCountByBannerLast24Hours(
	db: Kysely<Database>,
	banner_id: string,
) {
	return db
		.selectFrom((eb) =>
			eb
				.selectFrom("banned")
				.selectAll()
				// toISOString() returns the date in UTC format YYYY-MM-DDTHH:mm:ss.sssZ
				// but the database stores the datetime with format YYYY-MM-DD HH:mm:ss
				// so we remove the "T" so that the database can compare the datetime correctly
				.where(
					"created_at",
					">",
					new Date(Date.now() - 86400000).toISOString().replace("T", " "),
				)
				.as("bannedLast24Hours"),
		)
		.select(({ fn }) => [
			fn.count<number>("bannedLast24Hours.id").as("bansInLast24Hours"),
		])
		.where("bannedLast24Hours.banner_id", "=", banner_id)
		.execute();
}

export function insertNewBanRecord(
	db: Kysely<Database>,
	new_ban_record: NewBan,
) {
	return db.insertInto("banned").values(new_ban_record).execute();
}
