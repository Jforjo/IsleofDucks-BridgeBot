import { Message } from 'discord.js';
import type { BotEvent } from '../../utils.ts';

const ADMIN = "824393734921650247"; // Admin role ID

export default {
    id: "reset",
    once: false,
    run: async (bridge, _bot, message: Message) => {
        if (
            message.channel !== bridge.mineflayerDuck.officerChannel &&
            message.channel !== bridge.mineflayerDuckling.officerChannel &&
            message.channel !== bridge.combinedOfficerChannel
        ) return;
        if (!message.member) return;
        if (!message.member.roles.cache.has(ADMIN)) return;
        const args = message.content.split(' ').slice(1);
        const type = args[0].toLowerCase();
        if (args.length != 1 || (
            type !== "duck" &&
            type !== "duckling" &&
            type !== "hatchling" &&
            type !== "all" &&
            type !== "full"
        ) ) return;
        if (type === "duck") {
            bridge.mineflayerDuck.reconnecting = 0;
            bridge.mineflayerDuck.reconnectOrExit(bridge);
            await message.react('✅').catch(() => {});
        } else if (type === "duckling") {
            bridge.mineflayerDuckling.reconnecting = 0;
            bridge.mineflayerDuckling.reconnectOrExit(bridge);
            await message.react('✅').catch(() => {});
        } else if (type === "hatchling") {
            bridge.mineflayerHatchling.reconnecting = 0;
            bridge.mineflayerHatchling.reconnectOrExit(bridge);
            await message.react('✅').catch(() => {});
        } else if (type === "all") {
            bridge.mineflayerDuck.reconnecting = 0;
            bridge.mineflayerDuck.reconnectOrExit(bridge);
            bridge.mineflayerDuckling.reconnecting = 0;
            bridge.mineflayerDuckling.reconnectOrExit(bridge);
            bridge.mineflayerHatchling.reconnecting = 0;
            bridge.mineflayerHatchling.reconnectOrExit(bridge);
            await message.react('✅').catch(() => {});
        } else if (type === "full") {
            await message.react('✅').catch(() => {});
            process.exit(1);
        } else {
            await message.react("❌").catch(() => {});
        }
    },
} as BotEvent;