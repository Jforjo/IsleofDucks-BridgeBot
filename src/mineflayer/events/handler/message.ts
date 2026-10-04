import type { ChatMessage } from 'prismarine-chat';
import type { BotEvent } from '../../../utils.ts';

export default {
    id: "message",
    once: false,
    run: (bridge, bot, message: ChatMessage) => {
        if (/^[0-9,]+\/[0-9,]+❤\s+(?:.*)\s+[0-9,]+\/[0-9,]+✎ Mana$/gm.test(message.toString())) return;
        if (message.toString() == "EASTER EGG NEARBY!") return;
        if (message.toString() == "YOU WILL RESPAWN NEXT ROUND!") return;
        bridge.logger.log(`chat_message_${bot.name}`, message.toString());
        bridge.logger.log(`log_${bot.name}`, message.toString());
        // bot.chatLog.push(message.toString());
        // if (bot.chatLog.length > 50) bot.chatLog.shift();
    },
} as BotEvent;