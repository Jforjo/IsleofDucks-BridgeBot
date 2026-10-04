import { ComponentType, MessageFlags, type MessageCreateOptions } from 'discord.js';
import type { BotEvent } from '../../../utils.ts';

export default {
    id: "kicked",
    once: true,
    run: async (bridge, bot, reason: string, loggedIn: boolean) => {
        try {
            const reasonJson = JSON.parse(reason);
            if (
                "extra" in reasonJson &&
                Array.isArray(reasonJson.extra) &&
                reasonJson.extra.length > 0 &&
                "text" in reasonJson.extra[0]
            ) reason = reasonJson.extra[0].text;
        } catch {};

        let message: string;
        let tryToLogBackIn = true;
        switch (true) {
            case reason.includes("This proxy is being rebooted."):
                message = "a proxy reboot";
                break;
            case reason.includes("You logged in from another location!"):
                message = "a duplicate login";
                break;
            case reason.includes("Failed to authenticate your connection!"):
                message = "an authentication error";
                break;
            case reason.includes("Why do you send us invalid packets?"):
                message = "it sending invalid packets";
                break;
            case reason.includes("You have disconnected!"):
                message = "it being disconnected";
                tryToLogBackIn = false;
                break;
            case reason.includes("This server is currently in maintenance mode") ||
                reason.includes("is currently down for maintenance"):
                message = "Hypixel currently being in maintenance mode";
                tryToLogBackIn = false;
                break;
            case reason.includes("Your account has been blocked"):
                message = "the account being blocked";
                tryToLogBackIn = false;
                break;
            case reason.includes("Your account is temporarily blocked for"):
                message = "the account being temporarily blocked";
                tryToLogBackIn = false;
                break;
            case reason.includes("Double login!"):
                message = "a double login";
                tryToLogBackIn = false;
                break;
            case reason.includes("Chat message too long"):
                message = "trying to send a message that's too long";
                break;
            case reason.includes("You logged in from another location"):
                message = "logging in from a different location";
                tryToLogBackIn = false;
                break;
            default:
                message = "an unknown reason";
                break;
        }

        const content = {
            flags: MessageFlags.IsComponentsV2,
            components: [
                {
                    type: ComponentType.Container,
                    accent_color: 0xff0000,
                    components: [
                        {
                            type: ComponentType.TextDisplay,
                            content: `⚠️ The ${bot.name} bot was kicked from the server due to ${message}`
                        }
                    ]
                }
            ]
        } as MessageCreateOptions;
        
        if (bridge.combined.guild === true) await bridge.combinedGuildChannel?.send(content);
        else await bot.guildChannel?.send(content);
        
        if (bridge.combined.officer === true) await bridge.combinedOfficerChannel?.send(content);
        else await bot.officerChannel?.send(content);

        bridge.logger.log(`log_error_${bot.name}`,
            `The ${bot.name} bot was kicked from the server.\nReason: ${reason}\nLogged in: ${loggedIn}`
        );

        if (!tryToLogBackIn) bot.reconnecting = 10;
        else {
            if (loggedIn) bot.bot.quit();
            bot.bot.end();
        }
        // await bot.reconnectOrExit(bridge);
    },
} as BotEvent;