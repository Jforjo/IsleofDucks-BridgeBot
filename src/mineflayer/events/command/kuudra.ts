import type { BotEvent } from "../../../utils.ts";
import getKuudraData from "../../../requests/kuudra.ts";
import { formatNumberWithCommas, capataliseFirstLetter } from "../../../util/format.ts";

function isValidKuudra(query: string): Boolean {
    const kuudras = [
        "basic",
        "hot",
        "burning",
        "fiery",
        "infernal"
    ];
    if (kuudras.includes(query.toLowerCase())) return true;
    return false;
}

export default {
    id: "chat:commandKuudra",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17})(?: [^ ]* ?[^ ]*)?): )?!?(?:[kK][uU][uU][dD][rR][aA])(?: ([ a-zA-Z0-9_]+))?$/,
    run: async (
        bridge,
        bot,
        type: "Guild >" | "Officer >" | "From",
        rank: string | undefined,
        author: string,
        guildRank: string | undefined,
        bridgeAuthor: string | undefined,
        query: string | undefined
    ) => {
        if (bridgeAuthor && bridgeAuthor.startsWith(bridge.BRIDGE_CHAR)) return;
        
        const channel =
            type === "Officer >" ? "/oc" :
            type === "From" ? `/msg ${author}` :
            "/gc"
        ;
        
        let kuudra: string | undefined;
        let user: string;
        if (query) {
            let isKuudra = isValidKuudra(query);
            if (!isKuudra) {
                const tempKuudra = query.split(" ").slice(1).join(" ");
                isKuudra = isValidKuudra(tempKuudra);
                if (isKuudra) {
                    kuudra = tempKuudra;
                }
                user = query.split(" ")[0];
            } else {
                kuudra = query;
                user = bridgeAuthor || author;
            }
        } else {
            kuudra = query;
            user = bridgeAuthor || author;
        }
        const kuudraRes = await getKuudraData(user);
        
        if (!kuudraRes.success) {
            return bot.chat(`${channel} ${kuudraRes.message}`, bridge, "Failed to send kuudra error message", bot.name);
        }

        if (kuudra) {
            bot.chat(`${channel} ${kuudraRes.username}'s ${capataliseFirstLetter(kuudra)} Kuudra: ${formatNumberWithCommas(kuudraRes.comps[kuudra as keyof typeof kuudraRes.comps])}`, bridge, "Failed to send Kuudra message", bot.name);
        } else {
            bot.chat(`${channel} ${kuudraRes.username}'s Kuudra Coll: ${formatNumberWithCommas(kuudraRes.coll)} (${formatNumberWithCommas(kuudraRes.comps.basic)}, ${formatNumberWithCommas(kuudraRes.comps.hot)}, ${formatNumberWithCommas(kuudraRes.comps.burning)}, ${formatNumberWithCommas(kuudraRes.comps.fiery)}, ${formatNumberWithCommas(kuudraRes.comps.infernal)})`, bridge, "Failed to send Kuudra message", bot.name);
        }
    }
} as BotEvent;