import { Events, GuildAuditLogsEntry, Guild, AuditLogEvent, User } from 'discord.js';
import type { BotEvent } from '../../utils.ts';
import type Bridge from '../../bridge.ts';

async function Ban(bridge: Bridge, auditLogEntry: GuildAuditLogsEntry, add: boolean) {
    const bannedId: string | null = auditLogEntry.targetId;
    if (!bannedId) return;
    const bannedUser: User | null = auditLogEntry.target as User | null;
    if (!bannedUser) return;
    let executor = auditLogEntry.executor;
    if (!executor) return;
    // if partial then fetch
    if (executor.partial) executor = await executor.fetch();
    const reason: string = auditLogEntry.reason ?? 'None';


    await bridge.banLogChannel?.send({
        embeds: [{
            title: `Member ${add ? "Banned" : "Unbanned"}`,
            description: `<@${bannedId}> was ${add ? "banned" : "unbanned"}.`,
            color: 0xFB9B00,
            thumbnail: {
                url: `attachment://${bannedId}.png`
            },
            fields: [
                {
                    name: "Username",
                    value: bannedUser.username,
                    inline: true
                },
                {
                    name: "ID",
                    value: bannedId,
                    inline: true
                },
                {
                    name: "Reason",
                    value: reason
                },
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: `${add ? "Banned" : "Unbanned"} by ${executor.username} - ${executor.id}`
            }
        }],
        files: [{
            attachment: `${bannedUser.displayAvatarURL({ extension: 'png', size: 512 })}`,
            name: `${bannedId}.png`
        }],
    });
}

export default {
    id: Events.GuildAuditLogEntryCreate,
    once: false,
    run: async (bridge, _bot, auditLogEntry: GuildAuditLogsEntry, guild: Guild) => {
        if (guild.id !== bridge.GUILD_ID) return;

        switch (auditLogEntry.action) {
            case AuditLogEvent.MemberBanAdd:
                return await Ban(bridge, auditLogEntry, true);
            case AuditLogEvent.MemberBanRemove:
                return await Ban(bridge, auditLogEntry, false);
            default: return;
        }
    },
} as BotEvent;