import type { BotEvent } from "../../../utils.ts";
import getBankAndPurse from "../../../requests/bank.ts";
import { formatNumber, formatNumberWithCommas } from "../../../util/format.ts";

export default {
    id: "chat:commandBank",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?[bB][aA][nN][kK](?:[iI][nN][gG])?(?: (\w{2,17}))?$/,
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
            return bot.chat(`${channel} ${banking.message}`, bridge, "Failed to send bank error message", bot.name);
        }
        bot.chat(`${channel} ${banking.username}'s Bank: ${formatNumber(Math.floor(banking.bank))} (${formatNumberWithCommas(Math.floor(banking.bank))})`, bridge, "Failed to send bank message", bot.name);
    }
} as BotEvent;