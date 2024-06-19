import { Events, PermissionsBitField } from "discord.js";
import type { Message } from "discord.js/typings";
import type { Event } from "../events/types";

const messageCreate: Event = {
	name: Events.MessageCreate,
	once: false,
	async execute(message: Message) {
    if (message.channel.isDMBased()) {
      return;
      }
    console.log(message.content, message.channel.name);
    
	},
};

export default messageCreate;
