import type { BotEvent } from "../../../utils.ts";
import getFarmingWeight from "../../../requests/farmingWeight.ts";
import { formatNumberWithCommas } from "../../../util/format.ts";

export default {
    id: "chat:commandFarm",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?(?:[fF][wW]|[fF][aA][rR][mM]|[fF][aA][rR][mM][iI][nN][gG])(?: (\w{2,17}))?$/,
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
        const farm = await getFarmingWeight(target || bridgeAuthor || author);
        if (!farm.success) {
            return bot.chat(`${channel} ${farm.message}`, bridge, "Failed to send FarmingWeight error message", bot.name);
        }
        bot.chat(`${channel} ${farm.username}'s Farming Weight: ${formatNumberWithCommas(farm.weight)}${farm.rank === -1 ? '' : ` #${formatNumberWithCommas(farm.rank)}`}`, bridge, "Failed to send FarmingWeight message", bot.name);
    }
} as BotEvent;