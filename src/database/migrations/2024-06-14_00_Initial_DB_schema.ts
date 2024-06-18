import { type Kysely, sql } from "kysely";

// biome-ignore lint/suspicious/noExplicitAny: It's important to use Kysely<any> and not Kysely<YourDatabase>
export async function up(db: Kysely<any>): Promise<void> {
	/* Banned Table ______________________________________________________________ */
	await db.schema
		.createTable("banned")
		.addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
		.addColumn("user_id", "text", (col) => col.notNull())
		.addColumn("guild_id", "text", (col) => col.notNull())
		.addColumn("reason", "text", (col) => col.notNull())
		.addColumn("created_at", "text", (col) =>
			col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
		)
		.addColumn("ban_ends_at", "text")
		.addColumn("ban_duration_minutes", "integer", (col) => col.notNull())
		.execute();

	await db.schema
		.createIndex("banned_ban_ends_at_index")
		.on("banned")
		.column("ban_ends_at")
		.execute();

	await db.schema
		.createIndex("banned_user_id_index")
		.on("banned")
		.column("user_id")
		.execute();

	// Trigger to set "ban_ends_at" if it's not provided
	await sql`
		CREATE TRIGGER after_insert_in_banned_update_ban_ends_at
		AFTER INSERT ON banned
		FOR EACH ROW
		WHEN NEW.ban_ends_at IS NULL
		BEGIN
			UPDATE banned
			SET ban_ends_at = datetime(NEW.created_at, '+' || NEW.ban_duration_minutes || ' minutes')
			WHERE id = NEW.id;
		END;
	`.execute(db);

	/* Muted Table ______________________________________________________________ */
	await db.schema
		.createTable("muted")
		.addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
		.addColumn("user_id", "text", (col) => col.notNull())
		.addColumn("guild_id", "text", (col) => col.notNull())
		.addColumn("reason", "text")
		.addColumn("created_at", "text", (col) =>
			col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
		)
		.addColumn("mute_ends_at", "text")
		.addColumn("mute_duration_minutes", "integer", (col) => col.notNull())
		.execute();

	await db.schema
		.createIndex("muted_mute_ends_at_index")
		.on("muted")
		.column("mute_ends_at")
		.execute();

	await db.schema
		.createIndex("muted_user_id_index")
		.on("muted")
		.column("user_id")
		.execute();

	// Trigger to set "mute_ends_at" if it's not provided
	await sql`
		CREATE TRIGGER after_insert_in_muted_update_mute_ends_at
		AFTER INSERT ON muted
		FOR EACH ROW
		WHEN NEW.mute_ends_at IS NULL
		BEGIN
			UPDATE muted
			SET mute_ends_at = datetime(NEW.created_at, '+' || NEW.mute_duration_minutes || ' minutes')
			WHERE id = NEW.id;
		END;
	`.execute(db);
}

// biome-ignore lint/suspicious/noExplicitAny: It's important to use Kysely<any> and not Kysely<YourDatabase>
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("banned").execute();
	await db.schema.dropTable("muted").execute();
}
