// Useful links:
// https://discord.js.org/docs/packages/discord.js/14.15.3/ClientEvents:Interface
// https://discord.js.org/docs/packages/discord.js/main/Events:Enum

import ClientReadyEvent from "./clientReady";
import InteractionCreateEvent from "./interactionCreate";
import WebhooksUpdate from "./webhooksUpdate"
import MessageCreate from "./messageCreate"

export default [ClientReadyEvent, InteractionCreateEvent];
