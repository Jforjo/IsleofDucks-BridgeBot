import { MessageFlags, ComponentType, type MessageCreateOptions, escapeMarkdown } from "discord.js";
import type { BotEvent } from "../../../utils.ts";
import { capataliseFirstLetter } from "../../../util/format.ts";

export default {
    id: "chat:guildCantInvite",
    once: false,
    regex: /^You cannot invite this player to your guild!$/,
    run: async (bridge, bot, name: string) => {
        const content = {
            flags: MessageFlags.IsComponentsV2,
            components: [
                {
                    type: ComponentType.Container,
                    accent_color: 0xFB9B00,
                    components: [
                        {
                            type: ComponentType.TextDisplay,
                            content: `You can't invite this player!`
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