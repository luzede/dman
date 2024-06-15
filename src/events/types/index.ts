import type { ClientEvents } from "discord.js";

export interface Event {
	name: keyof ClientEvents;
	once: boolean;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	execute(...args: any[]): Promise<void> | void;
}
