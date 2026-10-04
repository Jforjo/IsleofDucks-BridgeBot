import type { BotEvent } from "../../../utils.ts";
import getColeWeight from "../../../requests/coleWeight.ts";
import { formatNumberWithCommas } from "../../../util/format.ts";

export default {
    id: "chat:commandCole",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?(?:[cC][wW]|[cC][oO][lL][eE])(?: (\w{2,17}))?$/,
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
        const cole = await getColeWeight(target || bridgeAuthor || author);
        if (!cole.success) {
            return bot.chat(`${channel} ${cole.message}`, bridge, "Failed to send ColeWeight error message", bot.name);
        }
        bot.chat(`${channel} ${cole.username}'s Cole Weight: ${formatNumberWithCommas(cole.weight)} #${formatNumberWithCommas(cole.rank)}`, bridge, "Failed to send ColeWeight message", bot.name);
    }
} as BotEvent;