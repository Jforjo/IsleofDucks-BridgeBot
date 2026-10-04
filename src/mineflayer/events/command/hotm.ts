import type { BotEvent } from "../../../utils.ts";
import getHOTMData from "../../../requests/hotm.ts";
import { formatNumber } from "../../../util/format.ts";

export default {
    id: "chat:commandHOTM",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?[hH][oO][tT][mM](?: (\w{2,17}))?$/,
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
        const hotm = await getHOTMData(target || bridgeAuthor || author);
        if (!hotm.success) {
            return bot.chat(`${channel} ${hotm.message}`, bridge, "Failed to send HOTM error message", bot.name);
        }
        bot.chat(`${channel} ${hotm.username}'s HOTM: HOTM ${hotm.HOTMLevel} | Powder: ${formatNumber(Math.floor(hotm.powder.mithril))}, ${formatNumber(Math.floor(hotm.powder.gemstone))}, ${formatNumber(Math.floor(hotm.powder.glacite))} | Ability: ${hotm.ability}`, bridge, "Failed to send HOTM message", bot.name);
    }
} as BotEvent;