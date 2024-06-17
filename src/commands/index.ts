// Useful links:
// https://discord.js.org/docs/packages/discord.js/14.15.3/Interaction:TypeAlias
// https://discord.js.org/docs/packages/discord.js/14.15.3/BaseInteraction:Class

import { Collection } from "discord.js";
import ping from "./ping";
import ban from "./ban";
import type { Command } from "../commands/types";

const commandsArray: Command[] = [ping, ban];

const commands = new Collection<string, Command>();
for (const command of commandsArray) {
	commands.set(command.data.name, command);
}

export default commands;
