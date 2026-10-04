import type { BotEvent } from "../../../utils.ts";

export default {
    id: "chat:commandLeave",
    once: false,
    regex: /^Party > (?:\[.{0,8}] )?(\w{2,16}): !?[lL](?:[eE][aA][vV][eE])?$/,
    run: async (
        bridge,
        bot,
        _author: string
    ) => {
        bot.chat(`/l`, bridge, "Failed to send lobby command", bot.name);
    }
} as BotEvent;