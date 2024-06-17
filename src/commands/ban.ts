// Useful links:
// https://discord.js.org/docs/packages/discord.js/14.15.3/GuildMember:Class

import { SlashCommandBuilder } from "discord.js";
import {
	banCountByBannerLast24Hours,
	insertNewBanRecord,
} from "../database/queries/banned";
import { SqliteError } from "better-sqlite3";
import { DiscordAPIError } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js/typings";
import type { Kysely } from "kysely";
import type { Database } from "../database/types/database";
import {
	createBanGuildMessageEmbed,
	createBanMessageEmbed,
} from "./embeds/ban";

export default {
	data: new SlashCommandBuilder()
		.setName("ban")
		.setDescription("Ban a user for a certain amount of time.")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("The user to ban.")
				.setRequired(true),
		)
		.addIntegerOption((option) =>
			option
				.setName("duration")
				.setDescription("The duration of the ban in minutes.")
				.addChoices([
					{ name: "minute", value: 1 },
					{ name: "hour", value: 60 },
					{ name: "day", value: 1440 },
					{ name: "week", value: 10080 },
					{ name: "month", value: 43200 },
					{ name: "year", value: 525600 },
				])
				.setMaxValue(525600)
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("reason")
				.setDescription("The reason for the ban.")
				.setMaxLength(512)
				.setRequired(true),
		),
	async execute(
		interaction: ChatInputCommandInteraction,
		db: Kysely<Database>,
	) {
		// Checks if the interaction is in a guild
		// and if app is in the guild while there are registered commands
		// pointing to this app.
		if (!interaction.inCachedGuild()) {
			await interaction.reply({
				content:
					"This command is only available in guilds with the app in the guild.",
				ephemeral: true,
			});
			return;
		}

		const banner_member = interaction.member;

		// Checks if the user has the required role to use this command.
		if (
			!banner_member.roles.cache.some((role) =>
				["admin", "moderator"].includes(role.name),
			)
		) {
			await interaction.reply({
				content: "You do not have the required role to use this command.",
				ephemeral: true,
			});
			return;
		}

		// Get the user to ban
		// The true parameter tells the function that the user is a required option thus it cannot be null
		const target = interaction.options.getUser("user", true);

		// Check if the target user is the bot that is running the command
		if (target.id === interaction.client.user.id) {
			await interaction.reply({
				content: "The bot cannot ban itself.",
				ephemeral: true,
			});
			return;
		}

		// Fetch the member object of the user from the guild
		// which will have the methods to ban the user
		// Useful links:
		// https://discord.js.org/docs/packages/discord.js/14.15.3/GuildMember:Class
		const target_member = await interaction.guild.members.fetch({
			user: target,
		});

		if (
			target_member.user.bot === true &&
			banner_member.id !== interaction.guild.ownerId
		) {
			await interaction.reply({
				content: "You cannot ban a bot.",
				ephemeral: true,
			});
			return;
		}

		// Check if the target user is the owner of the guild
		if (target_member.id === interaction.guild.ownerId) {
			await interaction.reply({
				content: "You cannot ban the owner of the guild.",
			});
			return;
		}

		const targetRolePosition = target_member.roles.highest.position; // The highest role position of the target user
		const bannerRolePosition = banner_member.roles.highest.position; // The highest role position of the banner user

		// Check if the target user has a higher or equal role than the banner user
		// and if the banner user is not the owner of the guild
		if (
			targetRolePosition >= bannerRolePosition &&
			banner_member.id !== interaction.guild.ownerId
		) {
			await interaction.reply({
				content: "You cannot ban a user with a higher or equal role than you.",
				ephemeral: true,
			});
			return;
		}

		const duration = interaction.options.getInteger("duration", true);
		const reason = interaction.options.getString("reason", true);

		// Defer the reply to show the loading state
		await interaction.deferReply({ ephemeral: false });

		try {
			// Check if the banner is not the owner of the guild
			// The owner of the guild does not have a limit on the number of bans they can make
			if (banner_member.id !== interaction.guild.ownerId) {
				// The number of people that got banned in the last 24 hours
				const [{ bansInLast24Hours }] = await banCountByBannerLast24Hours(
					db,
					banner_member.id,
				);

				if (bansInLast24Hours >= 3) {
					await interaction.editReply({
						content: "You have reached the limit of bans",
					});
					return;
				}
			}

			/*
				"GuildMember.id" always equals "User.id"
				So, you can use either "target.id" or "target_member.id"
    	*/
			// Adding the ban record to the database before banning the user
			await insertNewBanRecord(db, {
				user_id: target_member.id,
				guild_id: interaction.guild.id,
				banner_id: banner_member.id,
				ban_duration_minutes: duration,
				reason: reason,
			});

			// Sending a message to the user before banning them
			// It can fail but this should not stop the ban process
			await target_member
				.send({
					embeds: [
						createBanMessageEmbed(
							interaction.guild.name,
							banner_member.user,
							duration,
							reason,
						),
					],
				})
				.catch((_error) => {
					console.log(
						"Error while sending message to the user",
						target_member.user.tag,
					);
					// console.error(error);
				});

			// Banning the user
			await target_member.ban({
				reason: reason,
				// 5 hours in seconds
				deleteMessageSeconds: 18000,
			});

			await interaction.editReply({
				embeds: [
					createBanGuildMessageEmbed(
						target_member.user,
						banner_member.user,
						duration,
						reason,
					),
				],
			});
		} catch (error) {
			console.error("--------------------------------------------");
			console.error("Error while banning the user in commands/ban.ts");
			if (error instanceof SqliteError) console.error(error.code);
			else if (error instanceof DiscordAPIError)
				console.error(
					error.code,
					"\n",
					error.message,
					"\n",
					error.cause,
					"\n",
					error.stack,
				);
			else console.error("Unknown error in commands/ban.ts\n", error);
			console.error("--------------------------------------------");
			await interaction.deleteReply();
			await interaction.followUp({
				content: "There was an error while banning the user.",
				ephemeral: true,
			});
		}
	},
};
