import { ComponentType, escapeMarkdown, MessageFlags, type MessageCreateOptions } from "discord.js";
import { covnertRankToEmojis, getRankColour, type BotEvent } from "../../../utils.ts";
import updateRoles from '../../../requests/joinLeaveRole.ts';

export default {
    id: "chat:memberKick",
    once: false,
    regex: /^(\[.*])?\s*(\w{2,17}).*? was kicked from the guild by (\[.*])?\s*(\w{2,17}).*?!$/,
    run: async (
        bridge,
        bot,
        victimRank: string | undefined,
        victimUserame: string,
        authorRank: string | undefined,
        authorUserame: string
    ) => {
        bot.onlineCount = Number(bot.onlineCount) - Number(1);
        bot.totalCount = Number(bot.totalCount) - Number(1);

        const colour = getRankColour(authorRank);
        const authorRankEmoji = covnertRankToEmojis(authorRank);
        const victimRankEmoji = covnertRankToEmojis(victimRank);

        const content = {
            flags: MessageFlags.IsComponentsV2,
            components: [
                {
                    type: ComponentType.Container,
                    accent_color: colour,
                    components: [
                        {
                            type: ComponentType.TextDisplay,
                            content: `${authorRankEmoji ? authorRankEmoji + " " : ""}${escapeMarkdown(authorUserame)} kicked ${victimRankEmoji ? victimRankEmoji + " " : ""}${escapeMarkdown(victimUserame)}!`
                        }
                    ]
                }
            ]
        } as MessageCreateOptions;
        
        if (bridge.combined.guild === true) await bridge.combinedGuildChannel?.send(content);
        else await bot.guildChannel?.send(content);
        
        if (bridge.combined.officer === true) await bridge.combinedOfficerChannel?.send(content);
        else await bot.officerChannel?.send(content);

        // if (bridge.combinedGuild && type === "Guild") await combinedChannel?.send(content);
        // if (bridge.combinedOfficer && type === "Officer") await combinedChannel?.send(content);

        await updateRoles(victimUserame, bot.name, "left");
    }
} as BotEvent;