import type { BotEvent } from "../../../utils.ts";

export default {
    id: "chat:partyJoined",
    once: false,
    regex: /^(?:\[.*])?\s*(\w{2,17}) joined the party\.$/,
    run: async (
        bridge,
        bot,
        joined: string
    ) => {
        // if (bot.warps[joined.toLowerCase()]) {
        //     bot.warps[joined.toLowerCase()].status = "joined";
        //     bot.chat(`/p warp`, bridge, "Failed to send warp command", bot.name);
        //     await new Promise(resolve => setTimeout(resolve, 5000));
        //     await bot.continueWarps(bridge);
        // }
    }
} as BotEvent;