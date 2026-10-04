import { GuildMember, type Snowflake } from 'discord.js';
import type { BotEvent } from '../../utils.ts';

export const DISCORD_EPOCH = 1420070400000;

/**
 * Converts a snowflake ID string into a JS Date object using the provided epoch (in ms), or Discord's epoch if not provided
 * @param {Snowflake} snowflake The snowflake ID to convert
 * @param {number} [epoch=DISCORD_EPOCH] The epoch to use when converting the snowflake
 * @returns {Date} The Date object equivalent to the given snowflake ID
 */
export function ConvertSnowflakeToDate(snowflake: Snowflake, epoch: number = DISCORD_EPOCH): Date {
	// Convert snowflake to BigInt to extract timestamp bits
	// https://discord.com/developers/docs/reference#snowflakes
	const milliseconds = BigInt(snowflake) >> BigInt(22);
	return new Date(Number(milliseconds) + epoch);
}

export default {
    id: 'guildMemberRemove',
    once: false,
    run: async (bridge, _bot, member: GuildMember) => {
        if (member.guild.id !== bridge.GUILD_ID) return;

        const createdAt = ConvertSnowflakeToDate(member.user.id);
        await bridge.memberJoinLeaveChannel?.send({
            embeds: [{
                title: "Member Removed",
                description: `<@${member.user.id}> left or was removed from the server.`,
                color: 0xFF0000,
                thumbnail: {
                    url: `attachment://${member.user.id}.png`
                },
                fields: [
                    {
                        name: "Username",
                        value: member.user.username,
                        inline: true
                    },
                    {
                        name: "ID",
                        value: member.user.id,
                        inline: true
                    },
                    {
                        name: "Nickname",
                        value: member.nickname ?? "None",
                        inline: true
                    },
                    {
                        name: "Account Created",
                        value: createdAt ? `<t:${Math.floor(createdAt.getTime() / 1000)}:F>` : "Unavailable",
                        inline: true
                    },
                    {
                        name: "Joined Server",
                        value: member.joinedAt ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:F>` : "Unavailable",
                        inline: true
                    }
                ],
                timestamp: new Date().toISOString()
            }],
            files: [{
                attachment: `${member.displayAvatarURL({ extension: 'png', size: 512 })}`,
                name: `${member.user.id}.png`
            }],
        });
    },
} as BotEvent;