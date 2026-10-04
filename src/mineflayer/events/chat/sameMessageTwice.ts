import { ComponentType, MessageFlags, type MessageCreateOptions } from "discord.js";
import type { BotEvent } from "../../../utils.ts";

export default {
    id: "chat:sameMessageTwice",
    once: false,
    regex: /^You cannot say the same message twice!$/,
    run: async (bridge, bot) => {
        const content = {
            flags: MessageFlags.IsComponentsV2,
            components: [
                {
                    type: ComponentType.Container,
                    components: [
                        {
                            type: ComponentType.TextDisplay,
                            content: "You cannot say the same message twice!"
                        }
                    ]
                }
            ]
        } as MessageCreateOptions;
        
        if (bridge.combined.guild === true) await bridge.combinedGuildChannel?.send(content);
        else await bot.guildChannel?.send(content);
    },
} as BotEvent;