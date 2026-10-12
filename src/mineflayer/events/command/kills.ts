import type { BotEvent } from "../../../utils.ts";
import { formatNumberWithCommas } from "../../../util/format.ts";
import { getBestiaryKills } from "../../../requests/bestiary.ts";

export default {
    id: "chat:commandBestiaryKills",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?(?:[kK][iI][lL][lL][sS]|[bB][eE][sS][tT][iI][aA][rR][yY]) ([ a-zA-Z0-9_]+)$/,
    run: async (
        bridge,
        bot,
        type: "Guild >" | "Officer >" | "From",
        rank: string | undefined,
        author: string,
        guildRank: string | undefined,
        bridgeAuthor: string | undefined,
        query: string
    ) => {
        if (bridgeAuthor && bridgeAuthor.startsWith(bridge.BRIDGE_CHAR)) return;
        
        const channel =
            type === "Officer >" ? "/oc" :
            type === "From" ? `/msg ${author}` :
            "/gc"
        ;

        let bestiaryRes = await getBestiaryKills(bridgeAuthor || author);
        if (!bestiaryRes.success) {
            return bot.chat(`${channel} ${bestiaryRes.message}`, bridge, "Failed to send BestiaryKills error message", bot.name);
        }

        let bestiary: string;
        let isBestiary = Object.keys(bestiaryRes.bestiary).includes(query.toLowerCase().replaceAll(' ', '_'));
        if (!isBestiary) {
            const tempBestiary = query.split(" ").slice(1).join(" ");
            isBestiary = Object.keys(bestiaryRes.bestiary).includes(tempBestiary.toLowerCase().replaceAll(' ', '_'));
            if (!isBestiary) {
                return bot.chat(`${channel} Invalid Bestiary "${tempBestiary == "" ? query : tempBestiary}"`, bridge, "Failed to send Invalid BestiaryKills message", bot.name);
            }
            bestiaryRes = await getBestiaryKills(query.split(" ")[0]);
            if (!bestiaryRes.success) {
                return bot.chat(`${channel} ${bestiaryRes.message}`, bridge, "Failed to send BestiaryKills error message", bot.name);
            }
            bestiary = tempBestiary;
        } else {
            bestiary = query;
        }

        const selectedBestiary = bestiaryRes.bestiary[bestiary.toLowerCase().replaceAll(' ', '_')];
        if (!selectedBestiary) {
            return bot.chat(`${channel} Bestiary "${query}" not found for ${bestiaryRes.username}.`, bridge, "Failed to send BestiaryKills not found message", bot.name);
        }

        bot.chat(`${channel} ${bestiaryRes.username}'s ${bestiary.toLowerCase()} Bestiary: ${formatNumberWithCommas(selectedBestiary)}`, bridge, "Failed to send BestiaryKills message", bot.name);
    }
} as BotEvent;