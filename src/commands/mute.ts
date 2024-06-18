import { SlashCommandBuilder } from "discord.js";
import { insertNewMuteRecord } from "../database/queries/muted";
import { SqliteError } from "better-sqlite3";
import type { ChatInputCommandInteraction } from "discord.js/typings";
import type { Kysely } from "kysely";
import type { Database } from "../database/types/database";

const DEBUG_MODE = process.env?.DEBUG_MODE;

export default {
	data: new SlashCommandBuilder()
		.setName("mute")
		.setDescription("Mute a user for a certain amount of time.")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("The user to mute.")
				.setRequired(true),
		)
		.addIntegerOption((option) =>
			option
				.setName("duration")
				.setDescription("The duration of the mute.")
				.addChoices([
					{ name: "1 minute", value: 60000 },
					{ name: "5 minutes", value: 300000 },
					{ name: "10 minutes", value: 600000 },
					{ name: "1 hour", value: 3600000 },
					{ name: "1 day", value: 86400000 },
					{ name: "1 week", value: 604800000 },
				])
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("reason")
				.setDescription("The reason for the mute.")
				.setMaxLength(512),
		),

	async execute(
		interaction: ChatInputCommandInteraction,
		db: Kysely<Database>,
	) {
    // Deferring in the start because the command only does ephemeral responses
    await interaction.deferReply({ ephemeral: true });

    // Checks if the interaction is in a guild
		// and if app is in the guild while there are registered commands
		// pointing to this app.
		if (!interaction.inCachedGuild()) {
			await interaction.editReply({
				content:
					"This command is only available in guilds with the app in the guild.",
			});
			return;
		}
		
    const muter = interaction.member;

    if (
      !muter.roles.cache.some((role) =>
        ["admin", "moderator"].includes(role.name),
      )
		) {
      await interaction.editReply({
        content: "You do not have the required role to use this command.",
      });
      return;
	  }

    const target_user = interaction.options.getUser("user", true);

    // Check if the target user is the bot that is running the command
		if (target_user.id === interaction.client.user.id) {
			await interaction.editReply({
				content: "The bot cannot ban itself.",
			});
			return;
		}

    // This also checks if the user is in the guild or not and not just in cache
    const target = await interaction.guild.members.fetch({ user: target_user, force: true });

    if (target.id === interaction.client.user.id) {
      await interaction.editReply({
        content: "You cannot mute the bot.",
      });
      return;
    }

    if (target.id === interaction.guild.ownerId) {
      await interaction.editReply({
        content: "You cannot mute the owner of the server.",
      })
      return;
    }

    if (!target.roles.cache.some((role) => ["admin", "moderator"].includes(role.name))) {
      await interaction.editReply({
        content: "You cannot mute a user with the admin or moderator role.",
      })
      return;
    }

    const targetRolePosition = target.roles.highest.position; // The highest role position of the target user
		const muterRolePosition = muter.roles.highest.position; // The highest role position of the banner user

    if (muterRolePosition <= targetRolePosition) {
      await interaction.editReply({
        content: "You cannot mute a user with a higher or equal role.",
      });
      return;
    }


    const duration = interaction.options.getInteger("duration", true);
    const reason = interaction.options.getString("reason") || undefined;

    await target.timeout(duration, reason);

    const duration_minutes = duration / 60000;
    await insertNewMuteRecord(db, {
      user_id: target.id,
      guild_id: interaction.guild.id,
      muter_id: muter.id,
      reason: reason,
      mute_duration_minutes: duration_minutes,
    })
    .catch((error) => {
      if (DEBUG_MODE) {
        console.log("--------------------------------------------");
        console.error("Error inserting new mute record");
        if (error instanceof SqliteError) {
          console.error(error.code);
        } else {
          console.error("Unknown error during new mute record insertion in /src/commands/mute.ts");
        }
        console.log("--------------------------------------------");
      }
    });

    await interaction.editReply({
      content: `User ${target_user.tag} has been muted for ${duration_minutes} minutes.`,
    });
	},
};
