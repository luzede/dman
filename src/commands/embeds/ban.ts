import { EmbedBuilder, bold } from "discord.js";
import type { User } from "discord.js/typings";

export function createBanMessageEmbed(
	guild_name: string,
	banner: User,
	duration: number,
	reason: string,
) {
	let human_readable_duration: string;
	if (duration === 1) {
		human_readable_duration = "a minute";
	} else if (duration === 60) {
		human_readable_duration = "an hour";
	} else if (duration === 1440) {
		human_readable_duration = "a day";
	} else if (duration === 10080) {
		human_readable_duration = "a week";
	} else if (duration === 43200) {
		human_readable_duration = "a month";
	} else {
		human_readable_duration = "a year";
	}

	const embed = new EmbedBuilder()
		.setColor("#ff0000")
		.setAuthor({ name: banner.displayName, iconURL: banner.displayAvatarURL() })
		.setTitle(`Banned from ${guild_name}`)
		.setDescription(
			`You have been banned and are forbidden from rejoining ${guild_name} for **${human_readable_duration}**.`,
		);

	embed
		// .addFields({
		// 	name: "Duration:",
		// 	value: human_readable_duration,
		// })
		.addFields({
			name: "Reason:",
			value: reason,
		});

	return embed;
}

export function createBanGuildMessageEmbed(
	target: User,
	banner: User,
	duration: number,
	reason: string,
) {
	const embed = new EmbedBuilder()
		.setColor("#00FF00")
		.setAuthor({
			name: banner.displayName,
			iconURL: banner.displayAvatarURL(),
		})
		.setTitle(`${target.tag} banned`)
		.setDescription(
			`${bold(target.tag)} has been banned from the server for a certain amount of time.`,
		);

	let human_readable_duration: string;
	if (duration === 1) {
		human_readable_duration = "minute";
	} else if (duration === 60) {
		human_readable_duration = "hour";
	} else if (duration === 1440) {
		human_readable_duration = "day";
	} else if (duration === 10080) {
		human_readable_duration = "week";
	} else if (duration === 43200) {
		human_readable_duration = "month";
	} else {
		human_readable_duration = "year";
	}

	embed
		.addFields({
			name: "Duration:",
			value: human_readable_duration,
		})
		.addFields({
			name: "Reason:",
			value: reason,
		});

	return embed;
}
