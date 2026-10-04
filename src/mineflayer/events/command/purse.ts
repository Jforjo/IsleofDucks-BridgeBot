import type { BotEvent } from "../../../utils.ts";
import getBankAndPurse from "../../../requests/bank.ts";
import { formatNumber, formatNumberWithCommas } from "../../../util/format.ts";

export default {
    id: "chat:commandPurse",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?[pP][uU][rR][sS][eE](?: (\w{2,17}))?$/,
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

        const banking = await getBankAndPurse(target || bridgeAuthor || author);
        if (!banking.success) {
            return bot.chat(`${channel} ${banking.message}`, bridge, "Failed to send purse error message", bot.name);
        }
        bot.chat(`${channel} ${banking.username}'s Purse: ${formatNumber(Math.floor(banking.purse))} (${formatNumberWithCommas(Math.floor(banking.purse))})`, bridge, "Failed to send purse message", bot.name);
    }
} as BotEvent;