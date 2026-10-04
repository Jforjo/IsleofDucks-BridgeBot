import type { BotEvent } from "../../../utils.ts";

export default {
    id: "chat:skyblockJoin",
    once: false,
    regex: /^[0-9,]+\/[0-9,]+❤\s+(?:.*)\s+[0-9,]+\/[0-9,]+✎ Mana$/,
    run: (
        _bridge,
        bot
    ) => {
        bot.location = "skyblock";
    }
} as BotEvent;