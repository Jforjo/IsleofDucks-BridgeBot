import type { BotEvent } from "../../../utils.ts";

export default {
    id: "chat:useLobbyFirst",
    once: false,
    regex: /^Use \/lobby first!$/,
    run: (
        _bridge,
        bot
    ) => {
        bot.location = "limbo";
    }
} as BotEvent;