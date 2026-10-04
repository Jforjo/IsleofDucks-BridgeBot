import type { BotEvent } from "../../../utils.ts";

export default {
    id: "chat:partyRemoved",
    once: false,
    regex: /^(?:\[.*])?\s*(\w{2,17}) has been removed from the party\.$/,
    run: async (
        bridge,
        bot,
        removed: string
    ) => {
        // if (bot.warps[removed.toLowerCase()]) {
        //     bot.chat(`${bot.warps[removed.toLowerCase()].channel} ${removed} has been successfully warped! (probs)`, bridge, "Failed to send warp success message", bot.name);
        //     delete bot.warps[removed.toLowerCase()];
        // }
    }
} as BotEvent;