import { DiscordAPIError, Events } from "discord.js";
import type { Client } from "discord.js/typings";
import type { Event } from "../events/types";
import config from "../config";

const DEBUG_MODE = process.env?.DEBUG_MODE;

const clientReady: Event = {
	name: Events.ClientReady,
	once: true,
	async execute(client: Client) {
		console.log(`Ready! Logged in as ${client.user?.tag}!`);

		try {
	
			const guild = await client.guilds.fetch(config.GUILD_ID);
			
			const roles = guild.roles.cache;


			let adminRole = roles.find(role => role.name === "admin");

			if (adminRole === undefined) {
				adminRole = await guild.roles.create({
					name: "admin",
					color: "Purple",
					permissions: 699746926185793n,
					// Display role members separately from online members
					hoist: true,
				});
			}
			else {
				if (adminRole.permissions.bitfield !== 699746926185793n) {
					await adminRole.setPermissions(699746926185793n);
				}
				if (adminRole.hoist === false) {
					await adminRole.setHoist(true);
				}
			}

			const modRole = roles.find(role => role.name === "mod");

			if (modRole === undefined) {
				await guild.roles.create({
					name: "mod",
					color: "Yellow",
					permissions: 119196196785473n,
					position: adminRole.position,
					// Display role members separately from online members
					hoist: true,
				});
			}
			else {
				if (modRole.permissions.bitfield !== 119196196785473n) {
					await modRole.setPermissions(119196196785473n);
				}
				if (modRole.position > adminRole.position) {
					await modRole.setPosition(adminRole.position);
				}
				if (modRole.hoist === false) {
					await modRole.setHoist(true);
				}
			}
		}
		catch (error) {
			if (DEBUG_MODE) { 
				console.error("--------------------------------------------");
				console.error("Error in clientReady event");
				if (error instanceof DiscordAPIError) {
					console.error(error.code);
					console.error(error.message);
					console.error(error.cause);
					console.error(error.stack);
				}
				else {
					console.error("Unknown error in clientReady event\n", error);
				}
				console.error("--------------------------------------------");
			}

		}
	},
};

export default clientReady;
