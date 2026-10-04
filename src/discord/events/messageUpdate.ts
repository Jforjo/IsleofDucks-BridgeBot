import { Message } from 'discord.js';
import type { BotEvent } from '../../utils.ts';

export default {
    id: 'messageUpdate',
    once: false,
    run: async (bridge, _bot, oldMessage: Message, newMessage: Message) => {
        if (oldMessage.partial) oldMessage = await oldMessage.fetch();
        if (newMessage.partial) newMessage = await newMessage.fetch();
        if (newMessage.author.bot) return;
        if (!newMessage.editedAt) return;

        if (oldMessage.channel === bridge.countingChannel) {
            // Only delete if the message was the newest message in the channel
            const messages = await oldMessage.channel.messages.fetch({ limit: 2 });
            const newestMessage = messages.first();
            if (
                newestMessage?.id === newMessage.id &&
                oldMessage.content.split(' ')[0] !== newMessage.content.split(' ')[0]
            ) await newMessage.delete();
        }
    }
} as BotEvent;