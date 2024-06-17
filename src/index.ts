import config from "./config";
import commands from "./commands";
import events from "./events";
import db from "./database";
import { unbanAfterBanEnds } from "./service/unban_after_ban_duration";
import { recordsCleanup } from "./service/records_cleanup";
import { sleep } from "./utils";

import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
	],
});

// If I had done these manually, the function in client.on(event, function) would have been an async
// But since the function is calling an async function, I don't know if it is anti-pattern to make async function
// call async function without awaiting it
for (const event of events) {
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, commands, db));
	} else {
		client.on(event.name, (...args) => {
			event.execute(...args, commands, db);
		});
	}
}

(async () => {
	// Make sure the client is logged in before using it elsewhere
	await client.login(config.TOKEN);

	// Wait for the client to be ready before running the rest of the code
	// For some reason even though we await the client.login() function
	// the clientReady event is not fired immediately but after the
	// 'unbanAfterBanEnds' and 'recordsCleanup' functions throw an error or run successfully
	// Using 'sleep' function however guarantees that the clientReady event is fired
	// before the 'unbanAfterBanEnds' and 'recordsCleanup' functions
	await sleep(1000);
	unbanAfterBanEnds(client, db);
	recordsCleanup(db);
})();
