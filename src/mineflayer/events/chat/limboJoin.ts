import type { BotEvent } from "../../../utils.ts";

export default {
    id: "chat:limboJoin",
    once: false,
    regex: /^You were spawned in Limbo.$/,
    run: (
        _bridge,
        bot
    ) => {
        bot.location = "limbo";
    }
} as BotEvent;