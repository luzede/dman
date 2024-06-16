import config from "./config";
import commands from "./commands";
import events from "./events";
import db from "./database";

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

client.login(config.TOKEN);
