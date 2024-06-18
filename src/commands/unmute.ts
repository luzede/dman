import { SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js/typings";

export default {
	data: new SlashCommandBuilder()
		.setName("unmute")
		.setDescription("Unmutes the user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to unmute")
        .setRequired(true),
    )
    .addStringOption((option) => 
      option
        .setName("reason")
        .setDescription("The reason for the unmute")
    ),

	async execute(
		interaction: ChatInputCommandInteraction
	) {

    // Deferring in the start because the command only does ephemeral responses
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.inCachedGuild()) {
			await interaction.editReply({
				content:
					"This command is only available in guilds with the app in the guild.",
			});
			return;
		}

    const unmuter = interaction.member;

    if (
      !unmuter.roles.cache.some((role) =>
        ["admin", "moderator"].includes(role.name),
      )
		) {
      await interaction.editReply({
        content: "You do not have the required role to use this command.",
      });
      return;
	  }

    const target_user = interaction.options.getUser("user", true);

    if (
      target_user.id === unmuter.id ||
      target_user.id === interaction.client.user.id ||
      target_user.id === interaction.guild.ownerId
    ) {
      await interaction.editReply({
        content: "Invalid user to unmute."
      })
      return;
    }

    const target = await interaction.guild.members.fetch({ user: target_user, force: true });

    const targetRolePosition = target.roles.highest;
    const unmuterRolePosition = unmuter.roles.highest;

    if (unmuterRolePosition <= targetRolePosition) {
      await interaction.editReply({
        content: "Invalid user to unmute."
      })
      return;
    }

    const reason = interaction.options.getString("reason") || undefined;

    // Null value unmutes the user
    await target.timeout(null, reason);

    await interaction.editReply({
      content: `Successfully unmuted ${target_user.tag}.`
    })
	},
};
