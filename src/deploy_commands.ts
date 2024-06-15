import { REST, Routes } from "discord.js";
import config from "./config";
import type { RESTPutAPIApplicationGuildCommandsResult } from "discord.js/typings";

import commands from "./commands";

const rest = new REST({ version: "10" }).setToken(config.TOKEN);

const commandsJSON = commands.map((command) => command.data.toJSON());

(async () => {
	try {
		console.log("Started refreshing application (/) commands.");

		const data = (await rest.put(
			Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID),
			{ body: commandsJSON },
		)) as RESTPutAPIApplicationGuildCommandsResult;

		console.log(
			`Successfully reloaded all ${data.length} application (/) commands.`,
		);
	} catch (error) {
		console.error(error);
	}
})();
