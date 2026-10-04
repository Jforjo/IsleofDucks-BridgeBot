import { ComponentType, escapeMarkdown, MessageFlags, type MessageCreateOptions } from 'discord.js';
import { covnertRankToEmojis, getRankColour, type BotEvent } from '../../../utils.ts';
import getBan from '../../../requests/ban.ts';
import updateRoles from '../../../requests/joinLeaveRole.ts';
import autoCloseTicket from '../../../requests/autoCloseTicket.ts';
import { updateUserSuperlative } from '../../../requests/superlative.ts';

export default {
    id: "chat:memberJoinLeave",
    once: false,
    regex: /^(\[.*])?\s*(\w{2,17}).*? (joined|left) the guild!$/,
    run: async (
        bridge,
        bot,
        rank: string | undefined,
        username: string,
        type: "joined" | "left",
    ) => {
        bot.onlineCount = type === "joined" ? ( Number(bot.onlineCount) + Number(1) ) : ( Number(bot.onlineCount) - Number(1) );
        bot.totalCount = type === "joined" ? ( Number(bot.totalCount) + Number(1) ) : ( Number(bot.totalCount) - Number(1) );

        const colour = getRankColour(rank);
        const rankEmoji = covnertRankToEmojis(rank);

        const content = {
            flags: MessageFlags.IsComponentsV2,
            components: [
                {
                    type: ComponentType.Container,
                    accent_color: colour,
                    components: [
                        {
                            type: ComponentType.TextDisplay,
                            content: `${rankEmoji ? rankEmoji + " " : ""}${escapeMarkdown(username)} ${type} the ${bot.name} guild! (${bot.onlineCount}/${bot.totalCount})`
                        }
                    ]
                }
            ]
        } as MessageCreateOptions;
        
        if (bridge.combined.guild === true) await bridge.combinedGuildChannel?.send(content);
        else await bot.guildChannel?.send(content);
        
        if (bridge.combined.officer === true) await bridge.combinedOfficerChannel?.send(content);
        else await bot.officerChannel?.send(content);

        if (type === "joined") {
            const banned = await getBan(username);
            if (!banned.success) {
                return bot.chat(`/oc Failed to check if ${username} was banned: ${banned.message}`, bridge, "Failed to send ban check error message", bot.name);
            }

            if (banned.banned) {
                bot.bot.chat(`/g kick ${username} On ban list.`);
                return bot.chat(`/oc ${escapeMarkdown(username)} was automatically banned with reason: ${banned.reason}`, bridge, "Failed to send auto-ban message", bot.name);
            }

            bot.chat(`/gc Welcome ${username}! "/g discord" for our Discord server :)`, bridge, "Failed to send welcome message", bot.name);
            if (bridge.combined.guild) {
                if (bot.name === "duck")
                    bridge.mineflayerDuckling.chat(`${bridge.BRIDGE_CHAR}${username} joined the Duck guild!`, bridge, "Failed to send welcome message to combined chat", bot.name);
                if (bot.name === "duckling")
                    bridge.mineflayerDuck.chat(`${bridge.BRIDGE_CHAR}${username} joined the Duckling guild!`, bridge, "Failed to send welcome message to combined chat", bot.name);
            }
            await autoCloseTicket(username);
            await updateUserSuperlative(username, bot.name);
        }

        await updateRoles(username, bot.name, type);
    },
} as BotEvent;