import config from "./config";
import commands from "./commands";
import events from "./events";
import db from "./database";

import { Client, GatewayIntentBits } from "discord.js";

// declare module "discord.js/typings" {
// 	interface Client {
// 		commands: Collection<string, Command>;
// 	}
// }

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

// client.commands = commands;

// for (const command of commands) {
// 	client.commands.set(command.data.name, command);
// }

// client.on(Events.InteractionCreate, async (interaction) => {
// 	console.log(interaction);

// 	if (!interaction.isCommand()) return;
// 	const command = client.commands.get(interaction.commandName);

// 	if (!command) {
// 		console.error(`No command matching ${interaction.commandName} was found.`);
// 		return;
// 	}

// 	try {
// 		await command.execute(interaction);
// 	} catch (error) {
// 		console.error(error);
// 		if (interaction.replied || interaction.deferred) {
// 			await interaction.followUp({
// 				content: "There was an error while executing this command!",
// 				ephemeral: true,
// 			});
// 		} else {
// 			await interaction.reply({
// 				content: "There was an error while executing this command!",
// 				ephemeral: true,
// 			});
// 		}
// 	}
// });

// client.once(Events.ClientReady, (readyClient) => {
// 	console.log(`Logged in as ${readyClient.user?.tag}`);
// });

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

// (async () => {
// 	await db
// 		.insertInto("banned")
// 		.values({
// 			user_id: "123",
// 			reason: "Spamming",
// 			guild_id: "456",
// 			ban_duration_minutes: 60,
// 		})
// 		.execute();

// 	const banned = await db.selectFrom("banned").selectAll().execute();
// 	console.log(banned);
// })();

// console.log(commands);

// console.log(config);
