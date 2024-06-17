import { type Kysely, sql } from "kysely";

// biome-ignore lint/suspicious/noExplicitAny: It's important to use Kysely<any> and not Kysely<YourDatabase>
export async function up(db: Kysely<any>): Promise<void> {
	/* Banned Table ______________________________________________________________ */
	await db.schema
		.alterTable("banned")
		// If there are already values in the table and you create a column that defaults to a value
		// without "NOT NULL" then the column will be created with the default value but the existing
		// rows will have a NULL value in that column.
		// However, if you add "NOT NULL" then the column will be created that defaults to a value
		// and the existing rows will be assigned to have the default value since they can no longer be NULL
		/*
      Just to clarify - if "NOT NULL" is omitted from the command,
      the value for existing rows will NOT be updated and will remain NULL.
      If "NOT NULL" is included in the command, the value for existing rows WILL be updated to match the default.

      Useful link: https://stackoverflow.com/a/92101/18140743

      Even though the answer is for SQL Server, it works the same way for SQLite.
    */
		.addColumn("banner_id", "text", (col) => col.defaultTo("0").notNull())
		.execute();

	await db.schema
		.createIndex("banned_banner_id_index")
		.on("banned")
		.column("banner_id")
		.execute();

	await db.schema
		.createIndex("banned_created_at_index")
		.on("banned")
		.column("created_at")
		.execute();

	/* Muted Table ______________________________________________________________ */
	await db.schema
		.alterTable("muted")
		.addColumn("muter_id", "text", (col) => col.defaultTo("0").notNull())
		.execute();

	await db.schema
		.createIndex("muted_muter_id_index")
		.on("muted")
		.column("muter_id")
		.execute();

	await db.schema
		.createIndex("muted_created_at_index")
		.on("muted")
		.column("created_at")
		.execute();
}

// biome-ignore lint/suspicious/noExplicitAny: It's important to use Kysely<any> and not Kysely<YourDatabase>
export async function down(db: Kysely<any>): Promise<void> {
	/* Banned Table ______________________________________________________________ */
	await db.schema.dropIndex("banned_banner_id_index").execute();
	await db.schema.dropIndex("banned_created_at_index").execute();

	await db.schema.alterTable("banned").dropColumn("banner_id").execute();

	/* Muted Table ______________________________________________________________ */
	await db.schema.dropIndex("muted_muter_id_index").execute();
	await db.schema.dropIndex("muted_created_at_index").execute();

	await db.schema.alterTable("muted").dropColumn("muter_id").execute();
}
