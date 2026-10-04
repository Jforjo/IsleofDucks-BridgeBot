import { Message } from 'discord.js';
import type { BotEvent } from '../../utils.ts';
import * as Combine from '../prefixCommands/combine.ts';
import * as Reset from '../prefixCommands/reset.ts';
import * as Retry from '../prefixCommands/retry.ts';
import * as UpdateFilters from '../prefixCommands/updatefilters.ts';
import * as GuesstowinSetup from '../prefixCommands/guesstowin.ts';
import * as Counting from '../utils/counting.ts';
import * as Guesstowin from '../utils/guesstowin.ts';
import { capataliseFirstLetter, messageFilter } from '../../util/format.ts';

export default {
    id: 'messageCreate',
    once: false,
    run: async (bridge, bot, message: Message) => {
        if (message.channel === bridge.countingChannel)
            return await Counting.default.run(bridge, bot, message);
        if (message.channel === bridge.guesstowinChannel)
            return await Guesstowin.default.run(bridge, bot, message);
        if (
            message.channel === bridge.mineflayerDuck.officerChannel ||
            message.channel === bridge.mineflayerDuckling.officerChannel
        ) {
            if (message.content.startsWith('combine'))
                return await Combine.default.run(bridge, bot, message);
            if (message.content.startsWith('reset'))
                return await Reset.default.run(bridge, bot, message);
            if (message.content.startsWith('retry'))
                return await Retry.default.run(bridge, bot, message);
            if (message.content.startsWith('updatefilters'))
                return await UpdateFilters.default.run(bridge, bot, message);
            if (message.content.startsWith('guesstowin'))
                return await GuesstowinSetup.default.run(bridge, bot, message);
        }
        if (
            message.components.length > 0 ||
            message.embeds.length > 0 ||
            message.attachments.size > 0 ||
            message.member === null || 
            (
                message.author.bot &&
                message.author.id !== bridge.discord.user?.id &&
                // Bot Whitelist
                message.author.id !== "1357548227741749359" // Partyfinder
            ) || (
                message.channel !== bridge.mineflayerDuck.guildChannel &&
                message.channel !== bridge.mineflayerDuck.officerChannel &&
                message.channel !== bridge.mineflayerDuckling.guildChannel &&
                message.channel !== bridge.mineflayerDuckling.officerChannel &&
                message.channel !== bridge.combinedGuildChannel &&
                message.channel !== bridge.combinedOfficerChannel
            )
        ) return;

        const name = message.member.nickname || message.author.displayName;
        const messageContent = message.content;
        const channel =
            message.channel === bridge.mineflayerDuck.officerChannel || message.channel === bridge.mineflayerDuckling.officerChannel ?
                '/oc'
            : message.channel === bridge.combinedOfficerChannel ?
                '/oc'
            : '/gc';
        // const bridgeBot = bridge.mineflayerDuck.bot;
        const bridgeBot = message.channel === bridge.mineflayerDuck.guildChannel ||
                message.channel === bridge.mineflayerDuck.officerChannel ? bridge.mineflayerDuck : bridge.mineflayerDuckling;
        const isCombined = message.channel === bridge.combinedGuildChannel || message.channel === bridge.combinedOfficerChannel;

        if (channel === "/oc") {
            let matches = messageContent.match(/^log(?: (\w+))?(?: (\d+))?$/);
            if (matches) {
                const [_, name, page] = matches;
                if (isCombined) {
                    bridge.mineflayerDuck.chat(`/g log${name ? ` ${name}` : ""}${page ? ` ${page}` : " 1"}`, bridge, "Failed to send guild log command to Duck", "discord");
                    bridge.mineflayerDuckling.chat(`/g log${name ? ` ${name}` : ""}${page ? ` ${page}` : " 1"}`, bridge, "Failed to send guild log command to Duckling", "discord");
                } else {
                    bridgeBot.chat(`/g log${name ? ` ${name}` : ""}${page ? ` ${page}` : " 1"}`, bridge, `Failed to send guild log command to ${capataliseFirstLetter(bridgeBot.name)}`, "discord");
                }
                return;
            }
            matches = messageContent.match(/^kick (\w+)(?: (.+))?$/);
            if (matches) {
                const [_, name, reason] = matches;
                if (isCombined) {
                    bridge.mineflayerDuck.chat(`/g kick ${name}${reason ? ` ${reason}` : ""}`, bridge, "Failed to send guild kick command to Duck", "discord");
                    bridge.mineflayerDuckling.chat(`/g kick ${name}${reason ? ` ${reason}` : ""}`, bridge, "Failed to send guild kick command to Duckling", "discord");
                } else {
                    bridgeBot.chat(`/g kick ${name}${reason ? ` ${reason}` : ""}`, bridge, `Failed to send guild kick command to ${capataliseFirstLetter(bridgeBot.name)}`, "discord");
                }
                return;
            }
            let multipleMatches = [...messageContent.matchAll(/^setrank (\w+) (.+)$/gm)];
            if (multipleMatches && multipleMatches.length > 0) {
                if (isCombined) return message.channel.send("You cannot use the setrank command in combined channels.");
                for (const match of multipleMatches) {
                    const [_, name, rank] = match;
                    bridgeBot.chat(`/g setrank ${name} ${rank}`, bridge, `Failed to send guild setrank command to ${capataliseFirstLetter(bridgeBot.name)}`, "discord");
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                return;
            }
            matches = messageContent.match(/^invite (\w+)$/);
            if (matches) {
                if (isCombined) return message.channel.send("You cannot use the invite command in combined channels.");
                const [_, name] = matches;
                bridgeBot.chat(`/g invite ${name}`, bridge, `Failed to send guild invite command to ${capataliseFirstLetter(bridgeBot.name)}`, "discord");
                return;
            }
            matches = messageContent.match(/^online$/);
            if (matches) {
                if (isCombined) {
                    bridge.mineflayerDuck.chat(`/g online`, bridge, `Failed to send guild online command to Duck`, "discord");
                    bridge.mineflayerDuckling.chat(`/g online`, bridge, `Failed to send guild online command to Duckling`, "discord");
                } else {
                    bridgeBot.chat(`/g online`, bridge, `Failed to send guild online command to ${capataliseFirstLetter(bridgeBot.name)}`, "discord");
                }
                return;
            }
        }

        try {
            await message.delete();
        } catch (e) {
            bridge.logger.log("log_error", `Failed to delete message: ${e}`);
        }

        if (message.member.nickname && bridge.mineflayerDuck.isMuted(message.member.nickname)) return;
        if (message.member.nickname && bridge.mineflayerDuckling.isMuted(message.member.nickname)) return;

        // const messageFiltered = messageContent.split(" ").map(word => {
        //     // Attempt at replacing actual emojis with text (doesn't work)
        //     // if (word.includes(":"))
        //     //     if (Object.keys(bridge.emojis).map(emoji => `:${emoji}:`).includes(word.toLowerCase().replaceAll(/[^a-z0-9:]/gi, "")))
        //     //         return bridge.emojis[word.toLowerCase().replaceAll(/[^a-z0-9]/gi, "")];
        //     // else
        //     //     if (Object.keys(bridge.emojis).includes(word))
        //     //         return bridge.emojis[word];
        //     // if (Object.keys(bridge.emojis).map(emoji => `:${emoji}:`).includes(word.toLowerCase().replaceAll(/[^a-z0-9:]/gi, ""))) {
        //     //     if (word.split(':').length !== 3) return word;
        //     //     return bridge.emojis[word.toLowerCase().replaceAll(/[^a-z0-9]/gi, "")];
        //     // }
        //     // const cleaned = word.toLowerCase().replaceAll(/[^a-z0-9:]/gi, "");
        //     // if (cleaned.startsWith(":") && cleaned.endsWith(":")) {
        //     //     const emojiKey = cleaned.slice(1, -1); // remove the colons
        //     //     if (bridge.emojis.hasOwnProperty(emojiKey)) {
        //     //         // Ensure it's exactly like ":dab:" and not something malformed
        //     //         if (cleaned.split(":").length === 3) {
        //     //             return bridge.emojis[emojiKey];
        //     //         }
        //     //     }
        //     // }
        //     if (Object.keys(bridge.chatFilters).includes(word.toLowerCase().replaceAll(/[^a-z0-9:]/gi, "")))
        //         return bridge.chatFilters[word.toLowerCase().replaceAll(/[^a-z0-9:]/gi, "")];
        //     return word;
        // }).join(" ");

        const messageFiltered = messageFilter(messageContent, bridge.chatFilters);

        if (isCombined) {
            bridge.mineflayerDuck.chat(`${channel} ${name}: ${messageFiltered}`, bridge, "Failed to relay message to Duck", "discord");
            // bridge.mineflayerDuckling.chat(`${channel} ${bridge.BRIDGE_CHAR}${name}: ${messageFiltered}`, bridge, "Failed to relay message to Duckling", "discord");
        } else {
            bridgeBot.chat(`${channel} ${name}: ${messageFiltered}`, bridge, `Failed to relay message to ${capataliseFirstLetter(bridgeBot.name)}`, "discord");
        }
    },
} as BotEvent;