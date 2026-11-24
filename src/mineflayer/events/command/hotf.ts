import type { BotEvent } from "../../../utils.ts";
import getHOTFData from "../../../requests/hotf.ts";
import { formatNumber } from "../../../util/format.ts";

export default {
    id: "chat:commandHOTF",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17})(?: [^ ]* ?[^ ]*)?): )?!?[hH][oO][tT][fF](?: (\w{2,17}))?$/,
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
        const hotf = await getHOTFData(target || bridgeAuthor || author);
        if (!hotf.success) {
            return bot.chat(`${channel} ${hotf.message}`, bridge, "Failed to send HOTF error message", bot.name);
        }
        bot.chat(`${channel} ${hotf.username}'s HOTF: HOTF ${hotf.HOTFLevel} | Whispers: ${formatNumber(Math.floor(hotf.whispers.forest))}, ${formatNumber(Math.floor(hotf.whispers.desert))} | Ability: ${hotf.ability} | Gifts: ${formatNumber(Math.floor(hotf.gifts.fig))}, ${formatNumber(Math.floor(hotf.gifts.mangrove))}, ${formatNumber(Math.floor(hotf.gifts.helix))}`, bridge, "Failed to send HOTF message", bot.name);
    }
} as BotEvent;