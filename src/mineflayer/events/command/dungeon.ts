import type { BotEvent } from "../../../utils.ts";
import getCata from "../../../requests/cata.ts";
import { formatNumber, formatNumberWithCommas, capataliseFirstLetter } from "../../../util/format.ts";

function isValidCata(query: string): Boolean {
    const catas = [
        "entrance",
        "bonzo",
        "scarf",
        "professor",
        "thorn",
        "livid",
        "sadan",
        "necron"
    ];
    if (catas.includes(query.toLowerCase())) return true;
    return false;
}

export default {
    id: "chat:commandDungeon",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17})(?: [^ ]* ?[^ ]*)?): )?!?(?:[dD][uU][nN][gG][sS]?|[dD][uU][nN][gG][eE][oO][nN][sS]?)(?: ([ a-zA-Z0-9_]+))?$/,
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
        
        let cata: string | undefined;
        let user: string;
        if (query) {
            let isCata = isValidCata(query);
            if (!isCata) {
                const tempCata = query.split(" ").slice(1).join(" ");
                isCata = isValidCata(tempCata);
                if (isCata) {
                    cata = tempCata;
                }
                user = query.split(" ")[0];
            } else {
                cata = query;
                user = bridgeAuthor || author;
            }
        } else {
            cata = query;
            user = bridgeAuthor || author;
        }
        const cataRes = await getCata(user);
        
        if (!cataRes.success) {
            return bot.chat(`${channel} ${cataRes.message}`, bridge, "Failed to send cata error message", bot.name);
        }

        if (cata) {
            const coll = cataRes.bossColl[cata as keyof typeof cataRes.bossColl];
            bot.chat(`${channel} ${cataRes.username}'s Dungeon ${capataliseFirstLetter(cata)} Coll: ${formatNumberWithCommas(coll.normal + ((coll?.master ?? 0) * 2))} (${formatNumberWithCommas(coll.normal)}${coll?.master !== undefined ? `, ${formatNumberWithCommas(coll.master)}` : ''})`, bridge, "Failed to send Dungeon message", bot.name);
        } else {
            bot.chat(`${channel} ${cataRes.username}'s Dungeon Boss Coll: ${[
                `Bonzo: ${formatNumber(cataRes.bossColl.bonzo.normal + cataRes.bossColl.bonzo.master * 2)} (${formatNumber(cataRes.bossColl.bonzo.normal)}, ${formatNumber(cataRes.bossColl.bonzo.master)})`,
                `Scarf: ${formatNumber(cataRes.bossColl.scarf.normal + cataRes.bossColl.scarf.master * 2)} (${formatNumber(cataRes.bossColl.scarf.normal)}, ${formatNumber(cataRes.bossColl.scarf.master)})`,
                `Professor: ${formatNumber(cataRes.bossColl.professor.normal + cataRes.bossColl.professor.master * 2)} (${formatNumber(cataRes.bossColl.professor.normal)}, ${formatNumber(cataRes.bossColl.professor.master)})`,
                `Thorn: ${formatNumber(cataRes.bossColl.thorn.normal + cataRes.bossColl.thorn.master * 2)} (${formatNumber(cataRes.bossColl.thorn.normal)}, ${formatNumber(cataRes.bossColl.thorn.master)})`,
                `Livid: ${formatNumber(cataRes.bossColl.livid.normal + cataRes.bossColl.livid.master * 2)} (${formatNumber(cataRes.bossColl.livid.normal)}, ${formatNumber(cataRes.bossColl.livid.master)})`,
                `Sadan: ${formatNumber(cataRes.bossColl.sadan.normal + cataRes.bossColl.sadan.master * 2)} (${formatNumber(cataRes.bossColl.sadan.normal)}, ${formatNumber(cataRes.bossColl.sadan.master)})`,
                `Necron: ${formatNumber(cataRes.bossColl.necron.normal + cataRes.bossColl.necron.master * 2)} (${formatNumber(cataRes.bossColl.necron.normal)}, ${formatNumber(cataRes.bossColl.necron.master)})`,
            ].join(' | ')}`, bridge, "Failed to send Dungeon message", bot.name)
        }
    }
} as BotEvent;