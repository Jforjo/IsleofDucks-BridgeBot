import { ComponentType, escapeMarkdown, MessageFlags, type MessageCreateOptions } from "discord.js";
import { covnertRankToEmojis, getRankColour, type BotEvent } from "../../../utils.ts";
import { capataliseFirstLetter } from "../../../util/format.ts";

export default {
    id: "chat:guildInviteOffline",
    once: false,
    regex: /^You sent an offline invite to (\[.*])?\s*(\w{2,17}).*?! They will have 5 minutes to accept once they come online!$/,
    run: async (
        bridge,
        bot,
        rank: string | undefined,
        name: string,
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
                            content: `${rankEmoji ? rankEmoji + " " : ""}${escapeMarkdown(name)} has been sent an offline invite!`
                        },
                        { type: ComponentType.Separator },
                        {
                            type: ComponentType.TextDisplay,
                            content: `Isle of ${capataliseFirstLetter(bot.name)}s • <t:${Math.floor(Date.now() / 1000)}:F>`
                        }
                    ]
                }
            ]
        } as MessageCreateOptions;
        
        // if (bridge.combined.officer === true) await bridge.combinedOfficerChannel?.send(content);
        await bot.officerChannel?.send(content);
        if (bridge.combined.officer) await bridge.combinedOfficerChannel?.send(content);
    }
} as BotEvent;