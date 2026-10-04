import type { BotEvent } from "../../../utils.ts";

export default {
    id: "chat:partyInvited",
    once: false,
    regex: /^(?:\[.*])?\s*(?:\w{2,17}) invited (?:\[.*])?\s*(\w{2,17}) to the party! They have 60 seconds to accept\.$/,
    run: async (
        _bridge,
        bot,
        invited: string
    ) => {
        // if (bot.warps[invited.toLowerCase()]) {
        //     bot.warps[invited.toLowerCase()].status = "invited";
        //     // bot.bot.chat(`${bot.warps[invited].channel} ${invited} has been invited to my party!`);
        //     // await bot.continueWarps();
        // }
    }
} as BotEvent;