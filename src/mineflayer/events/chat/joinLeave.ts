import { ComponentType, escapeMarkdown, MessageFlags, type MessageCreateOptions } from 'discord.js';
import { capataliseFirstLetter } from "../../../util/format.ts";
import type { BotEvent } from '../../../utils.ts';

export default {
    id: "chat:joinLeave",
    once: false,
    regex: /^Guild > (\w{2,17}) (joined|left)\.$/,
    run: async (
        bridge,
        bot,
        member: string,
        type: "joined" | "left",
    ) => {
        bot.onlineCount = type === "joined" ? ( Number(bot.onlineCount) + Number(1) ) : ( Number(bot.onlineCount) - Number(1) );

        // const content = {
        //     flags: MessageFlags.IsComponentsV2,
        //     components: [
        //         {
        //             type: ComponentType.Container,
        //             accent_color: 0xFFFF00,
        //             components: [
        //                 {
        //                     type: ComponentType.TextDisplay,
        //                     content: `**${escapeMarkdown(member)}** ${type}. (${bot.onlineCount}/${bot.totalCount})`
        //                 }
        //             ]
        //         }
        //     ]
        // } as MessageCreateOptions;

        const content = {
            embeds: [
                {
                    color: 0xFFFF00,
                    description: `**${escapeMarkdown(member)}** ${type}. (${bot.onlineCount}/${bot.totalCount})`,
                    footer: {
                        text: `Isle of ${capataliseFirstLetter(bot.name)}s`
                    },
                    timestamp: new Date().toISOString(),
                }
            ]
        } as MessageCreateOptions;
        
        if (bridge.combined.guild === true) await bridge.combinedGuildChannel?.send(content);
        else await bot.guildChannel?.send(content);

        if (type === "joined" && member === "Ducksicle") {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            bot.chat(`/gc Welcome Princess!`, bridge, "Failed to send welcome message for Duck", bot.name);
        }
    },
} as BotEvent;