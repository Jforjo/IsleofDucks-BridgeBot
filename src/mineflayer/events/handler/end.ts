import type { BotEvent } from "../../../utils.ts";

export default {
    id: "end",
    once: true,
    run: async (bridge, bot, reason: string) => {
        bridge.logger.log(`log_error_${bot.name}`, `The ${bot.name} bot session has abruptly ended: ${reason}`);
        await bot.reconnectOrExit(bridge);
    },
} as BotEvent;