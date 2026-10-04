import { MessageFlags, ComponentType, type MessageCreateOptions } from "discord.js";
import type { BotEvent } from "../../../utils.ts";
import { mineflayer as mineflayerViewer } from "prismarine-viewer";

function randomInterval<T extends any[]>(
    callback: (...args: T) => Promise<void> | void,
    min: number,
    max: number,
    ...args: T
): void {
    const rand = Math.round(Math.random() * (max - min + 1) + min);

    Promise.resolve(callback(...args)).then(() => {
        setTimeout(() => randomInterval(callback, min, max, ...args), rand);
    });
}

export default {
    id: "spawn",
    once: true,
    run: async (bridge, bot) => {
        bot.reconnecting = 1;

        const content = {
            flags: MessageFlags.IsComponentsV2,
            components: [
                {
                    type: ComponentType.Container,
                    accent_color: 0x00ff00,
                    components: [
                        {
                            type: ComponentType.TextDisplay,
                            content: `**The ${bot.name} bot has logged in and is now ready!**`
                        }
                    ]
                }
            ]
        } as MessageCreateOptions;
        
        if (bridge.combined.guild === true) await bridge.combinedGuildChannel?.send(content);
        else await bot.guildChannel?.send(content);
        
        if (bridge.combined.officer === true) await bridge.combinedOfficerChannel?.send(content);
        else await bot.officerChannel?.send(content);

        bridge.logger.log(`log_info_${bot.name}`, `The ${bot.name} bot has spawned in and is now ready!`);
        if (!bot.viewerActive) {
            // setInterval(() => {
            //     bot.bot.chat("/g online");
            // }, 1000 * 60 * 5);
            // randomInterval(() => {
            //     bot.bot.chat("/g online");
            // }, 1000 * 60 * 60 * 12, 1000 * 60 * 60 * 24);
            setInterval(() => {
                bot.bot.chat("/tipall");
            }, 1000 * 61 * 15);
            // setInterval(async () => {
                await Promise.all([
                    bridge.updateChatFilters(),
                    // bridge.updateEmojis(),
                ]);
            // }, 1000 * 60 * 10);
        }

        bot.currentlyReconnecting = false;
        await bot.loadMainEvents(bridge);

        setTimeout(() => {
            if (!bot.viewerActive) {
                mineflayerViewer(bot.bot, { port: bot.viewerPort, firstPerson: true });
                bot.viewerActive = true;
            }
            bot.chat("/g online", bridge, "Failed to send online command", bot.name);
            bot.chat("/limbo", bridge, "Failed to send limbo command", bot.name);
        }, 1000 * 3);
    },
} as BotEvent;