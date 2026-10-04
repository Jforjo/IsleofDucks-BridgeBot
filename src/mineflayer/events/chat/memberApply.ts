import { ComponentType, escapeMarkdown, MessageFlags, type MessageCreateOptions } from 'discord.js';
import { covnertRankToEmojis, getRankColour, type BotEvent } from '../../../utils.ts';
import getRecruit from '../../../requests/recruit.ts';

export default {
    id: "chat:memberApply",
    once: false,
    regex: /-----------------------------------------------------\s(\[.*])?\s*(\w{2,17}).*? has requested to join the Guild!\sClick here to accept or type \/guild accept (?:\w{2,17})!\s-----------------------------------------------------/,
    run: async (
        bridge,
        bot,
        rank: string | undefined,
        username: string
    ) => {
        const colour = getRankColour(rank);
        const rankEmoji = covnertRankToEmojis(rank);

        if (bot.name === "hatchling") {
            return bot.chat(`/g accept ${username}`, bridge, "Failed to auto accept hatchling guild members", bot.name);
        }

        const content = {
            flags: MessageFlags.IsComponentsV2,
            components: [
                {
                    type: ComponentType.Container,
                    accent_color: colour,
                    components: [
                        {
                            type: ComponentType.TextDisplay,
                            content: `${rankEmoji ? rankEmoji + " " : ""}${escapeMarkdown(username)} has requested to join the ${bot.name} Guild!`
                        }
                    ]
                }
            ]
        } as MessageCreateOptions;
        
        if (bridge.combined.officer === true) await bridge.combinedOfficerChannel?.send(content);
        else await bot.officerChannel?.send(content);


        const recruit = await getRecruit(username, bot.name);
        if (!recruit.success) {
            await bot.officerChannel?.send({
                flags: MessageFlags.IsComponentsV2,
                components: [
                    {
                        type: ComponentType.Container,
                        accent_color: 0xff0000,
                        components: [
                            {
                                type: ComponentType.TextDisplay,
                                content: `Failed to check stats of ${escapeMarkdown(username)} ${recruit.message}`
                            }
                        ]
                    }
                ]
            });
            return bot.chat(`/oc Failed to check stats of ${username} ${recruit.message}`, bridge, "Failed to send apply error message", bot.name);
        }

        if ('banned' in recruit) {
            return bot.chat(`/oc ${username} is banned with reason: ${recruit.reason}`, bridge, "Failed to send banned apply message", bot.name);
        }

        const missingAPIs = [] as string[];
        if (!recruit.data.apis.inventory) missingAPIs.push("Inventory");
        if (!recruit.data.apis.banking) missingAPIs.push("Banking");
        if (!recruit.data.apis.collection) missingAPIs.push("Collection");
        if (!recruit.data.apis.skills) missingAPIs.push("Skills");
        if (!recruit.data.apis.vault) missingAPIs.push("Vault");

        bot.chat(`/oc ${username}: Level ${Math.floor(recruit.data.experience / 100)}/${Math.floor(recruit.data.req / 100)} - ${missingAPIs.length > 0 ? `Missing APIs: ${missingAPIs.join(", ")}` : "All APIs on"}`, bridge, "Failed to send apply stats message", bot.name);
    },
} as BotEvent;