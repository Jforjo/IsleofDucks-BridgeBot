import type { BotEvent } from "../../../utils.ts";

export default {
    id: "chat:memberCount",
    once: false,
    regex: /^(Online|Total) Members: (\d+)$/,
    run: (
        bridge,
        bot,
        type: "Online" | "Total",
        count: number
    ) => {
        if (type === "Online") bot.onlineCount = count;
        else bot.totalCount = count;

        bridge.logger.log(`log_info_${bot.name}`, `Member count updated for ${bot.name}s: ${type} Members: ${count}`);

        bridge.setStatus();
    }
} as BotEvent;