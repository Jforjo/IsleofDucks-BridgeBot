import getBazaar from "../../../requests/bazaar.ts";
import { formatNumber } from "../../../util/format.ts";
import type { BotEvent } from "../../../utils.ts";

export default {
    id: "chat:commandBz",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?[bB][zZ] (.*)$/,
    run: async (
        bridge,
        bot,
        type: "Guild >" | "Officer >" | "From",
        rank: string | undefined,
        author: string,
        guildRank: string | undefined,
        bridgeAuthor: string | undefined,
        item: string
    ) => {
        if (bridgeAuthor && bridgeAuthor.startsWith(bridge.BRIDGE_CHAR)) return;
        
        const channel =
            type === "Officer >" ? "/oc" :
            type === "From" ? `/msg ${author}` :
            "/gc"
        ;

        const bazaar = await getBazaar(item);
        if (!bazaar.success) return bot.chat(`${channel} ${bazaar.message}`, bridge, "Failed to send getBazaar error message", bot.name);
        
        bot.chat(`${channel} ${bazaar.bazaar.name} bz: ${formatNumber(bazaar.bazaar.sell)} / ${formatNumber(bazaar.bazaar.buy)}`, bridge, "Failed to send bz command result", bot.name);
    }
} as BotEvent;