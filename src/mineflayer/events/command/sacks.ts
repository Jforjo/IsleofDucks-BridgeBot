import type { BotEvent } from "../../../utils.ts";
import getSacksNetworth from "../../../requests/sacks.ts";
import { formatNumber } from "../../../util/format.ts";

export default {
    id: "chat:commandSacks",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?(?:[sS][aA][cC][kK][sS]?|[sS][aA][xX])(?: (\w{2,17}))?$/,
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

        const networth = await getSacksNetworth(target || bridgeAuthor || author);
        if (!networth.success) {
            return bot.chat(`${channel} ${networth.message}`, bridge, "Failed to send sack networth error message", bot.name);
        }
        bot.chat(`${channel} ${networth.username}'s sacks: ${formatNumber(networth.networth)}`, bridge, "Failed to send sack networth message", bot.name);
    }
} as BotEvent;