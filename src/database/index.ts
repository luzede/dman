import type { Database } from "./types/database";
import SQLite from "better-sqlite3"; // You can import it as any name, in the docs it is imported as "Database"
import { Kysely, SqliteDialect } from "kysely";

// The file is named index.ts because it allows import from folders without specifying the file name
// and since the folder name is already database, it is easier to read and understand what is being imported

const dialect = new SqliteDialect({
	database: new SQLite("src/database/main.db"),
});

const db = new Kysely<Database>({
	dialect,
});

export default db;
