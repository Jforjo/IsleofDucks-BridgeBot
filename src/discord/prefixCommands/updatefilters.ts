import { Message } from 'discord.js';
import type { BotEvent } from '../../utils.ts';

const ADMIN = "824393734921650247"; // Admin role ID

export default {
    id: "updatefilters",
    once: false,
    run: async (bridge, _bot, message: Message) => {
        if (
            message.channel !== bridge.mineflayerDuck.officerChannel &&
            message.channel !== bridge.mineflayerDuckling.officerChannel &&
            message.channel !== bridge.combinedOfficerChannel
        ) return;
        if (!message.member) return;
        if (!message.member.roles.cache.has(ADMIN) && message.member.user.id !== "1287662103414571009") return;
        await Promise.all([
            bridge.updateChatFilters(),
            // bridge.updateEmojis(),
        ]);
        await message.react("✅").catch(() => {});
    },
} as BotEvent;