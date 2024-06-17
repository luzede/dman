import type { Database } from "../database/types";
import SQLite from "better-sqlite3"; // You can import it as any name, in the docs it is imported as "Database"
import { Kysely, SqliteDialect } from "kysely";

// The file is named index.ts because it allows import from folders without specifying the file name
// and since the folder name is already database, it is easier to read and understand what is being imported

const dialect = new SqliteDialect({
	database: new SQLite("src/database/main.db", {
		// better-sqlite3 is by design synchronous so it locks down the thread when it waits for a response
		// which is why the wait time should be kept low, much lower than 3 seconds so that subsequent event handlers are not blocked
		// and are able to deferReply to the interaction
		// 100ms is a good value for the timeout
		timeout: 100,
	}),
});

const db = new Kysely<Database>({
	dialect,
});

export default db;
