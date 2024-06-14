import path from "node:path";
import SQLite from "better-sqlite3";
import { promises as fs } from "node:fs"; // importing promises from node:fs and renaming it to fs means you are specifically importing the Promise-based API of the Node.js File System module
import {
	Kysely,
	Migrator,
	SqliteDialect,
	FileMigrationProvider,
	type MigrationResult,
	NO_MIGRATIONS,
} from "kysely";

process.argv.forEach((val, index) => {
	console.log(`${index}: ${val}`);
});

(async () => {
	const db = new Kysely({
		dialect: new SqliteDialect({
			database: new SQLite(path.join(__dirname, "main.db")),
		}),
	});

	const migrator = new Migrator({
		db,
		provider: new FileMigrationProvider({
			fs,
			path,
			migrationFolder: path.join(__dirname, "./migrations"),
		}),
	});

	let error: unknown;
	let results: MigrationResult[] | undefined;

	// Migrate to the latest version of the database schema
	if (
		process.argv.length === 2 ||
		(process.argv.length === 3 && process.argv[2] === "latest")
	) {
		({ error, results } = await migrator.migrateToLatest());
	}
	// Rollback the last migration
	else if (process.argv.length === 3 && process.argv[2] === "down") {
		({ error, results } = await migrator.migrateDown());
	}
	// Migrate up to the given migration
	else if (process.argv.length === 3 && process.argv[2] === "up") {
		({ error, results } = await migrator.migrateUp());
	}
	// Migrate to the given migration
	else if (process.argv.length === 3) {
		if (process.argv[2] === "NO_MIGRATIONS") {
			({ error, results } = await migrator.migrateTo(NO_MIGRATIONS));
		} else {
			const date = process.argv[2].slice(0, 10);
			const files = await fs.readdir(path.join(__dirname, "./migrations"));
			let migration_filename: string | undefined;
			for (const file of files) {
				if (file.startsWith(date)) {
					migration_filename = file.slice(0, -3);
					break;
				}
			}

			if (migration_filename === undefined) {
				console.error("No migration found for the given date or filename");
				process.exit(1);
			}

			({ error, results } = await migrator.migrateTo(migration_filename));
		}
	} else {
		console.error("Invalid command line arguments");
		process.exit(1);
	}

	if (results !== undefined) {
		for (const it of results) {
			if (it.status === "Success") {
				console.log(
					`migration "${it.migrationName}" was executed successfully`,
				);
			} else if (it.status === "Error") {
				console.error(`failed to execute migration "${it.migrationName}"`);
			}
		}
	}

	if (error) {
		console.error(error);
		console.error(error);
		process.exit(1);
	}

	await db.destroy();
})();
