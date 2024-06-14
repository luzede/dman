import config from "./config";
import commands from "./commands";
import db from "./database";

(async () => {
	await db
		.insertInto("banned")
		.values({
			user_id: "123",
			reason: "Spamming",
			guild_id: "456",
			ban_duration_minutes: 60,
		})
		.execute();

	const banned = await db.selectFrom("banned").selectAll().execute();
	console.log(banned);
})();

console.log(commands);

console.log(config);
