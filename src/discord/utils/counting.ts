import { ComponentType, Message, MessageFlags } from 'discord.js';
import type { BotEvent } from '../../utils.ts';
import type Bridge from '../../bridge.ts';

const ADMIN = "824393734921650247"; // Admin role ID
const BLACKLISTED = "985708515484114966"; // Activity blacklist role
const ACTIVITYREQ = "983211131894128640"; // Activity 1 role (the requirement)

async function findPreviousMessage(bridge: Bridge): Promise<Message | undefined> {
    if (!bridge.countingChannel) return;
    // Get previous messages with newest msg being first
    const messages = await bridge.countingChannel.messages.fetch({ limit: 20 });
    for (const message of messages.sort((a, b) => b.createdTimestamp - a.createdTimestamp).values()) {
        const num = parseInt(message.content.split(' ')[0]);
        if (isNaN(num)) continue;
        if (message.reactions.cache.some(reaction => reaction.emoji.name === '❌' && reaction.users.cache.has(bridge.discord.user?.id || ""))) {
            return;
        }
        if (message.reactions.cache.some(reaction => reaction.emoji.name === '✅' && reaction.users.cache.has(bridge.discord.user?.id || ""))) {
            return message;
        }
    }
    return;
}

async function failUser(bridge: Bridge, message: Message): Promise<void> {
    if (message.channel !== bridge.countingChannel) return;
    if (!message.member) return;

    await message.react('❌').catch(() => {
        bridge.logger.log("log_error", "[DISCORD] Counting | Failed to react to the message with X emoji");
    });
    await bridge.countingChannel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [
            {
                type: ComponentType.Container,
                accent_color: 0xFB9B00,
                components: [
                    {
                        type: ComponentType.TextDisplay,
                        content: `<@${message.member.user.id}> ruined the count! Start over again from 1`
                    }
                ]
            }
        ]
    });
    if (!message.member.roles.cache.has(ADMIN)) {
        await bridge.countingChannel.permissionOverwrites.edit(message.member.user.id, { SendMessages: false }).catch(() => {
            bridge.logger.log("log_error", `[DISCORD] Counting | Failed to edit permissions for user ${message.member?.user.tag} (${message.member?.user.id})`)
        });
    }
    return;
}

export default {
    id: "reset",
    once: false,
    run: async (bridge, _bot, message: Message) => {
        if (message.channel !== bridge.countingChannel) return;
        if (!message.member) return;
        if (message.member.user.bot) return;
        if (message.member.roles.cache.has(BLACKLISTED)) return await message.delete();
        if (!message.member.roles.cache.has(ACTIVITYREQ)) return await message.delete();
        const num = parseInt(message.content.split(' ')[0]);
        if (isNaN(num)) return await failUser(bridge, message);
        const prevMsg = await findPreviousMessage(bridge);
        if (!prevMsg) {
            if (num !== 1) return await failUser(bridge, message);
            await message.react('✅').catch(() => {
                bridge.logger.log("log_error", "[DISCORD] Counting | Failed to react to the message with tick emoji");
            });
        } else {
            if (!prevMsg.author) {
                bridge.logger.log("log_error", "[DISCORD] Counting | Missing author from previous message");
                return await message.delete();
            }
            if (prevMsg.author.id === message.member.user.id) {
                bridge.logger.log("log_info", `[DISCORD] Counting | Duplicate message, user: ${message.author.username} - ${message.author.id}`);
                return await message.delete();
            }
            const prevNum = parseInt(prevMsg.content.split(' ')[0]);
            if (isNaN(prevNum)) return await failUser(bridge, message);
            if (num !== prevNum + 1) return await failUser(bridge, message);
            await message.react('✅').catch(() => {
                bridge.logger.log("log_error", "[DISCORD] Counting | Failed to react to the message with tick emoji");
            });
        }
    },
} as BotEvent;