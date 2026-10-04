import type { BotEvent } from "../../../utils.ts";
import getNetworth from "../../../requests/networth.ts";
import { formatNumber } from "../../../util/format.ts";

export default {
    id: "chat:commandNW",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?[nN][wW](?: (\w{2,17}))?$/,
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

        const networth = await getNetworth(target || bridgeAuthor || author);
        if (!networth.success) {
            return bot.chat(`${channel} ${networth.message}`, bridge, "Failed to send networth error message", bot.name);
        }
        bot.chat(`${channel} ${networth.username}'s networth: ${formatNumber(networth.networth)}`, bridge, "Failed to send networth message", bot.name);
    }
} as BotEvent;