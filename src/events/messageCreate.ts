import { Events } from "discord.js";
import type { Message } from "discord.js/typings";
import type { Event } from "../events/types";

const clientReady: Event = {
	name: Events.MessageCreate,
	once: false,
	execute(message: Message) {
		console.log(message.content, message.channel);
	},
};

export default clientReady;
