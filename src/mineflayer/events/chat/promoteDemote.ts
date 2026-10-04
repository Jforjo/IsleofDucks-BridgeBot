import { ComponentType, escapeMarkdown, MessageFlags, type MessageCreateOptions } from "discord.js";
import { covnertRankToEmojis, getRankColour, type BotEvent } from "../../../utils.ts";

export default {
    id: "chat:promoteDemote",
    once: false,
    regex: /^(\[.*])?\s*(\w{2,17}).*? was (promoted|demoted) from (.*) to (.*)$/,
    run: async (
        bridge,
        bot,
        rank: string | undefined,
        username: string,
        type: "promoted" | "demoted",
        oldRank: string,
        newRank: string
    ) => {
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
                            content: `${rankEmoji ? rankEmoji + " " : ""}${escapeMarkdown(username)} was ${type} from ${oldRank} to ${newRank}.`
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
    }
} as BotEvent;