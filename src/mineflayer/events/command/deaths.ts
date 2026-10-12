import type { BotEvent } from "../../../utils.ts";
import { formatNumberWithCommas } from "../../../util/format.ts";
import { getBestiaryDeaths } from "../../../requests/bestiary.ts";

export default {
    id: "chat:commandBestiaryDeaths",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?(?:[dD][eE][aA][tT][hH][sS]) ([ a-zA-Z0-9_]+)$/,
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

        let bestiaryRes = await getBestiaryDeaths(bridgeAuthor || author);
        if (!bestiaryRes.success) {
            return bot.chat(`${channel} ${bestiaryRes.message}`, bridge, "Failed to send BestiaryDeaths error message", bot.name);
        }

        let death: string;
        let isDeath = Object.keys(bestiaryRes.deaths).includes(query.toLowerCase().replaceAll(' ', '_'));
        if (!isDeath) {
            const tempDeath = query.split(" ").slice(1).join(" ");
            isDeath = Object.keys(bestiaryRes.deaths).includes(tempDeath.toLowerCase().replaceAll(' ', '_'));
            if (!isDeath) {
                return bot.chat(`${channel} Invalid Deaths "${tempDeath == "" ? query : tempDeath}"`, bridge, "Failed to send Invalid BestiaryDeaths message", bot.name);
            }
            bestiaryRes = await getBestiaryDeaths(query.split(" ")[0]);
            if (!bestiaryRes.success) {
                return bot.chat(`${channel} ${bestiaryRes.message}`, bridge, "Failed to send BestiaryDeaths error message", bot.name);
            }
            death = tempDeath;
        } else {
            death = query;
        }

        const selectedDeath = bestiaryRes.deaths[death.toLowerCase().replaceAll(' ', '_')];
        if (!selectedDeath) {
            return bot.chat(`${channel} Deaths "${query}" not found for ${bestiaryRes.username}.`, bridge, "Failed to send BestiaryDeaths not found message", bot.name);
        }

        bot.chat(`${channel} ${bestiaryRes.username}'s ${death.toLowerCase()} Deaths: ${formatNumberWithCommas(selectedDeath)}`, bridge, "Failed to send BestiaryDeaths message", bot.name);
    }
} as BotEvent;