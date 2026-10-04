import { ComponentType, GuildMember, MessageFlags } from 'discord.js';
import type { BotEvent } from '../../utils.ts';
import { ConvertSnowflakeToDate } from './guildMemberRemove.ts';

export default {
    id: 'guildMemberAdd',
    once: false,
    run: async (bridge, _bot, member: GuildMember) => {
        if (member.guild.id !== bridge.GUILD_ID) return;

        const createdAt = ConvertSnowflakeToDate(member.user.id);
        await bridge.memberJoinLeaveChannel?.send({
            embeds: [{
                title: "Member Added",
                description: `<@${member.user.id}> joined from the server.`,
                color: 0x00FF00,
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
                        name: "Account Created",
                        value: createdAt ? `<t:${Math.floor(createdAt.getTime() / 1000)}:F>` : "Unavailable",
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
        
        // await bridge.welcomeChannel?.send({
        //     content: `Hey <@${member.id}>!`,
        //     embeds: [{
        //         title: "✧˖ °.♡ ˖ Welcome to Isle of Ducks ˖ ♡.° ˖✧",
        //         description: [
        //             "Make sure to verify here <#1287099048796356608> to access the full server. ٩(ˊᗜˋ*)و 💜",
        //             "Join our guild! <#1320463957273739274> ༄ ˖°. 🍃.ೃ࿔: ･"
        //         ].join('\n'),
        //         color: 0xBD42FF,
        //         image: {
        //             url: `attachment://${member.id}.gif`
        //         }
        //     }],
        //     files: [{
        //         attachment: `https://isle-of-ducks.vercel.app/api/welcomegif?avatar=${member.displayAvatarURL({ extension: 'png', size: 512 })}`,
        //         name: `${member.id}.gif`
        //     }],
        // });
        
        await bridge.welcomeChannel?.send({
            flags: MessageFlags.IsComponentsV2,
            components: [
                {
                    type: ComponentType.TextDisplay,
                    content: `Hey <@${member.id}>!`
                },
                {
                    type: ComponentType.Container,
                    accent_color: 0xBD42FF,
                    components: [
                        {
                            type: ComponentType.MediaGallery,
                            items: [
                                {
                                    // load avatar of user who ran the command
                                    media: {
                                        url: `attachment://${member.id}.gif`,
                                    },
                                },
                            ]
                        },
                        {
                            type: ComponentType.TextDisplay,
                            content: `**Verify here <#1287099048796356608> and join our guild <#1320463957273739274>!**`,
                        }
                    ]
                }
            ],
            files: [{
                attachment: `https://isle-of-ducks.vercel.app/api/welcomegif/v3?avatar=${member.displayAvatarURL({ extension: 'png', size: 512 })}`,
                name: `${member.id}.gif`
            }],
        });
    },
} as BotEvent;