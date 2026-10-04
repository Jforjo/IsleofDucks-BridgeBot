import { ComponentType, MessageFlags, type MessageCreateOptions } from "discord.js";
import type { BotEvent } from "../../../utils.ts";

export default {
    id: "chat:guildQuestComplete",
    once: false,
    regex: /^\s{17}GUILD QUEST COMPLETED!$/,
    run: async (bridge, bot) => {
        const content = {
            flags: MessageFlags.IsComponentsV2,
            components: [
                {
                    type: ComponentType.Container,
                    accent_color: 0xFB9B00,
                    components: [
                        {
                            type: ComponentType.TextDisplay,
                            content: `### The guild has completed this week's Guild Quest!`
                        }
                    ]
                }
            ]
        } as MessageCreateOptions;
        
        if (bridge.combined.guild === true) await bridge.combinedGuildChannel?.send(content);
        else await bot.guildChannel?.send(content);
        // await bot.officerChannel?.send(content);
    },
} as BotEvent;