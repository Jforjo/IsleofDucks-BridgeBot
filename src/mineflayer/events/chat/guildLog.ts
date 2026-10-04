import { MessageFlags, ComponentType, type MessageCreateOptions, escapeMarkdown } from "discord.js";
import type { BotEvent } from "../../../utils.ts";
import { capataliseFirstLetter } from "../../../util/format.ts";

export default {
    id: "chat:guildLog",
    once: false,
    regex: /(-----------------------------------------------------\s*(?:<< )?Guild Log \(Page \d+ of \d+\)(?: >>)?\s*[\s\S]*\s*-----------------------------------------------------)/,
    run: async (bridge, bot, message: string) => {
        const content = {
            flags: MessageFlags.IsComponentsV2,
            components: [
                {
                    type: ComponentType.Container,
                    accent_color: 0xFB9B00,
                    components: [
                        {
                            type: ComponentType.TextDisplay,
                            content: escapeMarkdown(message)
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
    },
} as BotEvent;