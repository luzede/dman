import { Events } from "discord.js";
import type { Client, ForumChannel, MediaChannel, NewsChannel, TextChannel, VoiceChannel } from "discord.js/typings";
import type { Event } from "../events/types";

const clientReady: Event = {
	name: Events.WebhooksUpdate,
	once: false,
	execute(channel: TextChannel | NewsChannel | VoiceChannel | ForumChannel | MediaChannel) {
		console.log(channel.toJSON());
	},
};

export default clientReady;
