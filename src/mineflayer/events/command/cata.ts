import type { BotEvent } from "../../../utils.ts";
import getCata from "../../../requests/cata.ts";
import { formatNumber } from "../../../util/format.ts";

export default {
    id: "chat:commandCata",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?[cC][aA][tT][aA](?: (\w{2,17}))?$/,
    run: async (
        bridge,
        bot,
        type: "Guild >" | "Officer >" | "From",
        rank: string | undefined,
        author: string,
        guildRank: string | undefined,
        bridgeAuthor: string | undefined,
        target: string | undefined
    ) => {
        if (bridgeAuthor && bridgeAuthor.startsWith(bridge.BRIDGE_CHAR)) return;

        const channel =
            type === "Officer >" ? "/oc" :
            type === "From" ? `/msg ${author}` :
            "/gc"
        ;
        const cata = await getCata(target || bridgeAuthor || author);
        if (!cata.success) {
            return bot.chat(`${channel} ${cata.message}`, bridge, "Failed to send cata error message", bot.name);
        }
        /**
         * Serendibite's Dungeon Stats: Cata 111.11 (11.11M),
         * Healer 11.11 (111.11M),
         * Mage 11.11 (111.11M),
         * Berserker 11.11 (111.11M),
         * Archer 11.11 (111.11M),
         * Tank 11.11 (111.11M),
         * Class Average 11.11,
         * Secrets: 111.11K
         */
        if (cata.classLevel === null || cata.classXp === null) return bot.chat(`${channel} ${cata.username}'s Dungeon Stats: ${[
            `Cata ${formatNumber(cata.cataLevel)} (${formatNumber(cata.cataXp)})`,
            `Secrets: ${formatNumber(cata.secrets)}`
        ].join(", ")}`, bridge, "Failed to send cata message", bot.name);

        bot.chat(`${channel} ${cata.username}'s Dungeon Stats: ${[
            `Cata ${formatNumber(cata.cataLevel)} (${formatNumber(cata.cataXp)})`,
            `Healer: ${formatNumber(cata.classLevel.healer || 0)} (${formatNumber(cata.classXp.healer || 0)})`,
            `Mage: ${formatNumber(cata.classLevel.mage || 0)} (${formatNumber(cata.classXp.mage || 0)})`,
            `Berserker: ${formatNumber(cata.classLevel.berserk || 0)} (${formatNumber(cata.classXp.berserk || 0)})`,
            `Archer: ${formatNumber(cata.classLevel.archer || 0)} (${formatNumber(cata.classXp.archer || 0)})`,
            `Tank: ${formatNumber(cata.classLevel.tank || 0)} (${formatNumber(cata.classXp.tank || 0)})`,
            `Class Average: ${formatNumber(Object.values(cata.classLevel).reduce((a, b) => a + b, 0) / Object.values(cata.classLevel).length)}`,
            `Secrets: ${formatNumber(cata.secrets)}`
        ].join(", ")}`, bridge, "Failed to send cata message", bot.name);
    }
} as BotEvent;