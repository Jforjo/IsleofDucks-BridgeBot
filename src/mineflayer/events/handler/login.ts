import type { BotEvent } from "../../../utils.ts";

export default {
    id: "login",
    once: true,
    run: async (bridge, bot) => {
        // bot.reconnecting = 1;

        // await bot.loadEvents(bridge);

        bridge.logger.log(`log_info_${bot.name}`, `The ${bot.name} bot has logged in!`);
    },
} as BotEvent;