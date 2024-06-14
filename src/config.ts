import dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID } = process.env;

const config = {
	TOKEN: DISCORD_TOKEN,
	CLIENT_ID: DISCORD_CLIENT_ID,
	GUILD_ID: DISCORD_GUILD_ID,
};

export default config;
