import { Events } from "discord.js";
import type { Client } from "discord.js/typings";
import type { Event } from "../events/types";

const clientReady: Event = {
	name: Events.ClientReady,
	once: true,
	execute(client: Client) {
		console.log(`Ready! Logged in as ${client.user?.tag}!`);
	},
};

export default clientReady;
