import { Message, PermissionsBitField, type MessageCreateOptions } from 'discord.js';
import type { BotEvent } from '../../utils.ts';

const ADMIN = "824393734921650247"; // Admin role ID

function embed(text: string): MessageCreateOptions {
    return {
        embeds: [
            {
                color: 0xFB9B00,
                description: text,
                timestamp: new Date().toISOString(),
            }
        ]
    };
}

export default {
    id: "combine",
    once: false,
    run: async (bridge, _bot, message: Message) => {
        if (
            message.channel !== bridge.mineflayerDuck.officerChannel &&
            message.channel !== bridge.mineflayerDuckling.officerChannel &&
            message.channel !== bridge.combinedOfficerChannel
        ) return;
        if (!message.member) return;
        if (!message.member.roles.cache.has(ADMIN)) return;
        if (message.content === "combine")
            return message.channel.send(embed(`Combination Status: **Guild**: ${bridge.combined.guild ? "Enabled" : "Disabled"} | **Officer**: ${bridge.combined.officer ? "Enabled" : "Disabled"}.`));
        const args = message.content.split(' ').slice(1);
        if (args.length != 1 || (
            args[0].toLowerCase() !== "guild" &&
            args[0].toLowerCase() !== "officer"
        ) ) return;
        const type = args[0].toLowerCase() === "officer" ? "officer" : "guild";
        const channelDuck = type === "guild" ? bridge.mineflayerDuck.guildChannel : bridge.mineflayerDuck.officerChannel;
        const channelDuckling = type === "guild" ? bridge.mineflayerDuckling.guildChannel : bridge.mineflayerDuckling.officerChannel;
        if (!channelDuck) {
            return bridge.logger.log("log_error", `[DISCORD] Channel not found for ${type} (Duck)`);
        }
        if (!channelDuckling) {
            return bridge.logger.log("log_error", `[DISCORD] Channel not found for ${type} (Duckling)`);
        }
        
        const combinedChannel = type === "guild" ? bridge.combinedGuildChannel : bridge.combinedOfficerChannel;
        if (!combinedChannel) {
            return bridge.logger.log("log_error", `[DISCORD] Combined channel not found for ${type}`);
        }

        if (bridge.combined[type] === false) {
        // if (
        //     ( type === "guild" && bridge.combinedGuild === false ) ||
        //     ( type === "officer" && bridge.combinedOfficer === false )
        // ) {
            let channelPerms = channelDuck.permissionOverwrites.cache;
            if (!channelPerms || channelPerms.size <= 1) {
                channelPerms = channelDuck.permissionOverwrites.valueOf();
            }
            if (!channelPerms || channelPerms.size <= 1) {
                await message.channel.send(embed(`Failed to combine ${type} channel`));
                return bridge.logger.log("log_error", `[DISCORD] Failed to fetch permission overwrites for duck ${type} channel`);
            }
            try {
                await combinedChannel.permissionOverwrites.set(channelPerms, `Combining ${args[0]} channels`);
            } catch (e) {
                await message.channel.send(embed(`An error occured while trying to combine ${type} channel`));
                return bridge.logger.log("log_error", `[DISCORD] An error occured while trying to combine ${type} channel (setting combined channel perms)\nError: ${e}`);
            }
            try {
                await channelDuck.permissionOverwrites.set([
                    {
                        id: bridge.GUILD_ID,
                        deny: [ PermissionsBitField.Flags.ViewChannel ],
                    }
                ], `Combining ${args[0]} channels`);
            } catch (e) {
                await message.channel.send(embed(`An error occured while trying to combine ${type} channel`));
                return bridge.logger.log("log_error", `[DISCORD] An error occured while trying to combine ${type} channel (setting duck channel perms)\nError: ${e}`);
            }
            try {
                await channelDuckling.permissionOverwrites.set([
                    {
                        id: bridge.GUILD_ID,
                        deny: [ PermissionsBitField.Flags.ViewChannel ],
                    }
                ], `Combining ${args[0]} channels`);
            } catch (e) {
                await message.channel.send(embed(`An error occured while trying to combine ${type} channel`));
                return bridge.logger.log("log_error", `[DISCORD] An error occured while trying to combine ${type} channel (setting duckling channel perms)\nError: ${e}`);
            }
            // bridge.combined = { [type]: true };
            if (type === "guild") bridge.combinedGuild = true;
            else if (type === "officer") bridge.combinedOfficer = true;
            bridge.mineflayerDuck.chat(`${type === "guild" ? "/gc" : "/oc"} This chat has been combined!`, bridge, `Failed to send combined message to ${type} chat`, `duck`);
            bridge.mineflayerDuckling.chat(`${type === "guild" ? "/gc" : "/oc"} This chat has been combined!`, bridge, `Failed to send combined message to ${type} chat`, `duckling`);
            await message.channel.send(embed(`Combined ${type} channels.`));
            return bridge.logger.log("log_info", `[DISCORD] Combined ${type} channels.`);
        } else if (bridge.combined[type] === true) {
        // } else if (
        //     ( type === "guild" && bridge.combinedGuild === true ) ||
        //     ( type === "officer" && bridge.combinedOfficer === true )
        // ) {
            let channelPerms = combinedChannel.permissionOverwrites.cache;
            if (!channelPerms || channelPerms.size <= 1) {
                channelPerms = combinedChannel.permissionOverwrites.valueOf();
            }
            if (!channelPerms || channelPerms.size <= 1) {
                await message.channel.send(embed(`Failed to separate ${type} channel`));
                return bridge.logger.log("log_error", `[DISCORD] Failed to fetch permission overwrites for combined ${type} channel`);
            }
            try {
                await channelDuck.permissionOverwrites.set(channelPerms, `Separating ${args[0]} channels`);
            } catch (e) {
                await message.channel.send(embed(`An error occured while trying to separate ${type} channel`));
                return bridge.logger.log("log_error", `[DISCORD] An error occured while trying to separate ${type} channel (setting duck channel perms)\nError: ${e}`);
            }
            try {
                await channelDuckling.permissionOverwrites.set(channelPerms, `Separating ${args[0]} channels`);
            } catch (e) {
                await message.channel.send(embed(`An error occured while trying to separate ${type} channel`));
                return bridge.logger.log("log_error", `[DISCORD] An error occured while trying to separate ${type} channel (setting duckling channel perms)\nError: ${e}`);
            }
            try {
                await combinedChannel.permissionOverwrites.set([
                    {
                        id: bridge.GUILD_ID,
                        deny: [ PermissionsBitField.Flags.ViewChannel ],
                    }
                ], `Separating ${args[0]} channels`);
            } catch (e) {
                await message.channel.send(embed(`An error occured while trying to separate ${type} channel`));
                return bridge.logger.log("log_error", `[DISCORD] An error occured while trying to separate ${type} channel(setting duckling channel perms)\nError: ${e}`);
            }
            // bridge.combined = { [type]: false };
            if (type === "guild") bridge.combinedGuild = false;
            else if (type === "officer") bridge.combinedOfficer = false;
            bridge.mineflayerDuck.chat(`${type === "guild" ? "/gc" : "/oc"} This chat has been separated!`, bridge, `Failed to send separated message to ${type} chat`, `duck`);
            bridge.mineflayerDuckling.chat(`${type === "guild" ? "/gc" : "/oc"} This chat has been separated!`, bridge, `Failed to send separated message to ${type} chat`, `duckling`);
            await message.channel.send(embed(`Separated ${type} channels.`));
            return bridge.logger.log("log_info", `[DISCORD] Separated ${type} channels.`);
        }
    },
} as BotEvent;