import type { BotEvent } from "../../../utils.ts";
import getLevel from "../../../requests/level.ts";
import { formatNumber } from "../../../util/format.ts";

export default {
    id: "chat:commandLevel",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?(?:[lL][vV][lL]|[lL][eE][vV][eE][lL])(?: (\w{2,17}))?$/,
    run: async (
        bridge,
        bot,
        type: "Guild >" | "Officer >" | "From",
        rank: string | undefined,
        author: string,
        guildRank: string | undefined,
        bridgeAuthor: string | undefined,
        target: string | undefined
    ) => {
        if (bridgeAuthor && bridgeAuthor.startsWith(bridge.BRIDGE_CHAR)) return;

        const channel =
            type === "Officer >" ? "/oc" :
            type === "From" ? `/msg ${author}` :
            "/gc"
        ;

        const level = await getLevel(target || bridgeAuthor ||author);
        if (!level.success) {
            return bot.chat(`${channel} ${level.message}`, bridge, "Failed to send level error message", bot.name);
        }
        bot.chat(`${channel} ${level.username}'s level: ${formatNumber(level.level)}`, bridge, "Failed to send level message", bot.name);
    }
} as BotEvent;