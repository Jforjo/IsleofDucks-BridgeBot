import type { BotEvent } from "../../../utils.ts";

export default {
    id: "chat:lobbyJoin",
    once: false,
    regex: /^(?:\s>>>\s)?\[.*]\s[\w]{2,17} (?:joined|spooked into|slid into) the lobby!(?:\s<<<)?$/,
    run: (
        _bridge,
        bot
    ) => {
        bot.location = "lobby";
    }
} as BotEvent;