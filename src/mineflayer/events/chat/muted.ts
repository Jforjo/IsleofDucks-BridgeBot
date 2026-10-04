import type { MessageCreateOptions } from "discord.js";
import type { BotEvent } from "../../../utils.ts";
import { capataliseFirstLetter } from "../../../util/format.ts";

export default {
    id: "chat:muted",
    once: false,
    regex: /^Your mute will expire in (.*)$/,
    run: async (bridge, bot, lengthOfTime: string) => {
        const content = {
            embeds: [
                {
                    color: 0xFB9B00,
                    description: `The bot has been muted for ${lengthOfTime}`,
                    footer: {
                        text: `Isle of ${capataliseFirstLetter(bot.name)}s`
                    },
                    timestamp: new Date().toISOString(),
                }
            ]
        } as MessageCreateOptions;
        
        if (bridge.combined.guild === true) await bridge.combinedGuildChannel?.send(content);
        else await bot.guildChannel?.send(content);
        
        if (bridge.combined.officer === true) await bridge.combinedOfficerChannel?.send(content);
        else await bot.officerChannel?.send(content);
    },
} as BotEvent;