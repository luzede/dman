import type { ClientEvents } from "discord.js";

// One of the types of arguments that can be passed to the execute method of an event
// along with the database and commands types that are added extra to the arguments.
// https://discord.js.org/docs/packages/discord.js/14.15.3/ClientEvents:Interface
// which is why I left it as any[], easier and nothing else can be passed to it either way.
export interface Event {
	name: keyof ClientEvents;
	once: boolean;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	execute(...args: any[]): Promise<void> | void;
}
