import type { BotEvent } from "../../../utils.ts";
import { getUserSuperlative } from "../../../requests/superlative.ts";
import { formatNumber } from "../../../util/format.ts";

export default {
    id: "chat:commandSuperlative",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?[sS][uU][pP][eE][rR][lL][aA][tT][iI][vV][eE](?: (\w{2,17}))?$/,
    run: async (
        bridge,
        bot,
        type: "Guild >" | "Officer >" | "From",
        rank: string | undefined,
        author: string,
        guildRank: string | undefined,
        bridgeAuthor: string | undefined,
        target?: string
    ) => {
        if (bridgeAuthor && bridgeAuthor.startsWith(bridge.BRIDGE_CHAR)) return;
        
        const channel =
            type === "Officer >" ? "/oc" :
            type === "From" ? `/msg ${author}` :
            "/gc"
        ;

        const superlative = await getUserSuperlative(target || bridgeAuthor || author);
        if (!superlative.success) {
            return bot.chat(`${channel} ${superlative.message}`, bridge, "Failed to send superlative error message", bot.name);
        }
        bot.chat(`${channel} ${superlative.username}'s superlative value: ${formatNumber(superlative.data.current - superlative.data.starting)} (${formatNumber(superlative.data.current)})`, bridge, "Failed to send superlative message", bot.name);
    }
} as BotEvent;