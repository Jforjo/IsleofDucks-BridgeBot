import getBinAuction from "../../../requests/auction.ts";
import { formatNumber } from "../../../util/format.ts";
import type { BotEvent } from "../../../utils.ts";

export default {
    id: "chat:commandLbin",
    once: false,
        regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?[lL][bB][iI][nN] (.*)$/,
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

        const auction = await getBinAuction(item);
        if (!auction.success) return bot.chat(`${channel} ${auction.message}`, bridge, "Failed to send getBinAuction error message", bot.name);
        
        bot.chat(`${channel} ${auction.auction.name} lbin: ${formatNumber(auction.auction.amount)}`, bridge, "Failed to send lbin command result", bot.name);
    }
} as BotEvent;