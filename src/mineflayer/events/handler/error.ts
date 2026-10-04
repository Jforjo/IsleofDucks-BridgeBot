import type { BotEvent } from "../../../utils.ts";

export default {
    id: "error",
    once: false,
    run: async (bridge, bot, error: Error) => {
        bridge.logger.log("log_error", `Encountered an unexpected error (${bot.name}):`, error.message);
        console.log(error);
        // await bot.reconnectOrExit(bridge);
    },
} as BotEvent;