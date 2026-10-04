import { ComponentType, escapeMarkdown, MessageFlags, type MessageCreateOptions } from "discord.js";
import type { BotEvent } from "../../../utils.ts";

export default {
    id: "chat:commentBlocked",
    once: false,
    regex: /^We blocked your comment "(.+)" because (.+)\. https:\/\/www\.hypixel\.net\/rules\/$/,
    run: async (
        bridge,
        bot,
        comment: string,
        reason: string
    ) => {
        const content = {
            flags: MessageFlags.IsComponentsV2,
            components: [
                {
                    type: ComponentType.Container,
                    accent_color: 0xff0000,
                    components: [
                        {
                            type: ComponentType.TextDisplay,
                            content: `"${escapeMarkdown(comment)}" was blocked by Hypixel because **${reason}**.`
                        }
                    ]
                }
            ]
        } as MessageCreateOptions;
        
        if (bridge.combined.guild === true) await bridge.combinedGuildChannel?.send(content);
        else await bot.guildChannel?.send(content);
    },
} as BotEvent;