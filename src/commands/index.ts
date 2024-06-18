// Useful links:
// https://discord.js.org/docs/packages/discord.js/14.15.3/Interaction:TypeAlias
// https://discord.js.org/docs/packages/discord.js/14.15.3/BaseInteraction:Class

import { Collection } from "discord.js";
import mute from "./mute";
import unmute from "./unmute";
import ban from "./ban";
import type { Command } from "../commands/types";

const commandsArray: Command[] = [ban, mute, unmute];

const commands = new Collection<string, Command>();
for (const command of commandsArray) {
	commands.set(command.data.name, command);
}

export default commands;
