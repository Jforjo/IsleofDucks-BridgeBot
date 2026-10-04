import type { BotEvent } from "../../../utils.ts";

export default {
    id: "chat:partyBotJoined",
    once: false,
    // You have joined [MVP++] J_forjoooooo's party!
    regex: /^You have joined (?:\[.*])?\s*(\w{2,17})'s party!$/,
    run: async (
        bridge,
        bot,
        joined: string
    ) => {
        // if (bot.warps[joined.toLowerCase()]) {
        //     delete bot.warps[joined.toLowerCase()];
        // }
        // if (joined !== "J_forjoooooo") return bot.chat("/p leave", bridge, "Failed to send leave party command", bot.name);
    }
} as BotEvent;