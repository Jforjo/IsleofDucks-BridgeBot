import { MessageFlags, ComponentType, type MessageCreateOptions } from "discord.js";
import type { BotEvent } from "../../../utils.ts";

export default {
    id: "chat:guildLevelUp",
    once: false,
    regex: /^\s{19}The Guild has reached Level (\d*)!$/,
    run: async (bridge, bot, guildLevel: number) => {
        bot.bot.chat(`/gc GG!`);

        const content = {
            flags: MessageFlags.IsComponentsV2,
            components: [
                {
                    type: ComponentType.Container,
                    accent_color: 0xFB9B00,
                    components: [
                        {
                            type: ComponentType.TextDisplay,
                            content: `# The ${bot.name} guild has leveled up to level **${guildLevel}**!`
                        }
                    ]
                }
            ]
        } as MessageCreateOptions;
        
        if (bridge.combined.guild === true) await bridge.combinedGuildChannel?.send(content);
        else await bot.guildChannel?.send(content);
        
        if (bridge.combined.officer === true) await bridge.combinedOfficerChannel?.send(content);
        else await bot.officerChannel?.send(content);
    },
} as BotEvent;