import { escapeMarkdown, type MessageCreateOptions } from "discord.js";
import { covnertRankToEmojis, getRankColour, type BotEvent } from "../../../utils.ts";
import { capataliseFirstLetter, messageFilter } from "../../../util/format.ts";
import getUsernameOrUUID from "../../../requests/uuid.ts";

export default {
    id: "chat:guildChat",
    once: false,
    regex: /^(Guild|Officer) > (\[.{0,8}])?\s*(\w{2,17})(?: (\[.{1,15}]))?: (.*)$/,
    run: async (
        bridge,
        bot,
        type: "Guild" | "Officer",
        rank: string | undefined,
        username: string,
        guildRank: string | undefined,
        message: string
    ) => {
        if (
            (bridge.combined.guild === true && type === "Guild") ||
            (bridge.combined.officer === true && type === "Officer")
        ) {
            if (username === bot.bot.username && message.startsWith(bridge.BRIDGE_CHAR)) return;
        }

        const channel = type === "Officer" ? bot.officerChannel : bot.guildChannel;
        const combinedChannel = type === "Officer" ? bridge.combinedOfficerChannel : bridge.combinedGuildChannel;
        const inGameChannel = type === "Officer" ? "/oc" : "/gc";

        const colour = getRankColour(rank);
        const rankEmoji = covnertRankToEmojis(rank);

        let uuidRes = await getUsernameOrUUID(username);
        // Count how many colons are in the message
        // if (message.split(':').length === 2) {
        //     if (message.startsWith(BRIDGE_CHAR)) return;
        //     const firstPart = message.split(":")[0].replaceAll(/[^a-zA-Z0-9_ ]/g, "").trim();
        //     if (firstPart.split(" ").length === 1) {
        //         try {
        //             const discordNameRes = await getUsernameOrUUID(firstPart);
        //             if (discordNameRes.success) uuidRes = discordNameRes;
        //         } catch (e) {
        //             if (typeof e === "string") {
        //                 bridge.logger.log(`log_error_${bot.name}`, e);
        //             } else if (e instanceof Error) {
        //                 bridge.logger.log(`log_error_${bot.name}`, e.message);
        //             }
        //         }
        //     }
        // }

        
        // const content = {
        //     flags: MessageFlags.IsComponentsV2,
        //     components: [
        //         {
        //             type: ComponentType.Container,
        //             accent_color: colour,
        //             components: [
        //                 {
        //                     type: ComponentType.TextDisplay,
        //                     content: [
        //                         `${rankEmoji ? rankEmoji + " " : ""}${escapeMarkdown(username)} ${guildRank}: ${escapeMarkdown(message)}`,
        //                         `-# Isle of ${capataliseFirstLetter(bot.name)}s • ${new Date().toISOString()}`
        //                     ].join("\n")
        //                 }
        //             ]
        //         }
        //     ]
        // } as MessageCreateOptions;

        const content = {
            embeds: [
                {
                    color: colour,
                    description: `${rankEmoji ? rankEmoji + " " : ""}${escapeMarkdown(username)}${guildRank ? ` ${guildRank}` : ''}: ${escapeMarkdown(message)}`,
                    footer: {
                        text: `Isle of ${capataliseFirstLetter(bot.name)}s`,
                        icon_url: uuidRes.success ?
                                `https://api.mineatar.io/face/${uuidRes.uuid}`
                            : undefined,
                    },
                    timestamp: new Date().toISOString(),
                }
            ]
        } as MessageCreateOptions;
        
        if (
            (bridge.combined.guild === true && type === "Guild") ||
            (bridge.combined.officer === true && type === "Officer")
        ) {
            const messageFiltered = messageFilter(message, bridge.chatFilters);

            if (bot.name === "duck") {
                if (username === bot.bot.username) {
                    bridge.mineflayerDuckling.chat(`${inGameChannel} ${bridge.BRIDGE_CHAR}${message}`, bridge, "Failed to relay guild message to Duckling", bot.name);
                } else {
                    bridge.mineflayerDuckling.chat(`${inGameChannel} ${bridge.BRIDGE_CHAR}${username}: ${messageFiltered}`, bridge, "Failed to relay guild message to Duckling", bot.name);
                }
            } else if (bot.name === "duckling") {
                if (username === bot.bot.username) {
                    bridge.mineflayerDuck.chat(`${inGameChannel} ${bridge.BRIDGE_CHAR}${message}`, bridge, "Failed to relay guild message to Duck", bot.name);
                } else {
                    bridge.mineflayerDuck.chat(`${inGameChannel} ${bridge.BRIDGE_CHAR}${username}: ${messageFiltered}`, bridge, "Failed to relay guild message to Duck", bot.name);
                }
            }
            await combinedChannel?.send(content);
        } else {
            const message = await channel?.send(content);
            if (!message) bridge.logger.log(`log_error_${bot.name}`, "Failed to relay message from in-game to Discord")
        }

        // if (bridge.combinedGuild && type === "Guild") await combinedChannel?.send(content);
        // if (bridge.combinedOfficer && type === "Officer") await combinedChannel?.send(content);
    }
} as BotEvent;