import type { BotEvent } from "../../../utils.ts";
import getSlayers from "../../../requests/slayer.ts";
import { formatNumber } from "../../../util/format.ts";

export default {
    id: "chat:commandSlayer",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?[sS][lL][aA][yY][eE][rR][sS]?(?: (\w{2,17}))?$/,
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

        const slayers = await getSlayers(target || bridgeAuthor || author);
        if (!slayers.success) {
            return bot.chat(`${channel} ${slayers.message}`, bridge, "Failed to send slayer error message", bot.name);
        }
        // bot.bot.chat(`${channel} ${slayers.username}'s slayers: ${[
        //     slayers.slayers.zombie.level,
        //     slayers.slayers.spider.level,
        //     slayers.slayers.wolf.level,
        //     slayers.slayers.enderman.level,
        //     slayers.slayers.blaze.level,
        //     slayers.slayers.vampire.level
        // ].join("-")}`);
        bot.chat(`${channel} ${slayers.username}'s slayers: ${[
            `Rev ${slayers.slayers.zombie.level} (${formatNumber(slayers.slayers.zombie.xp)})`,
            `Tara ${slayers.slayers.spider.level} (${formatNumber(slayers.slayers.spider.xp)})`,
            `Sven ${slayers.slayers.wolf.level} (${formatNumber(slayers.slayers.wolf.xp)})`,
            `Eman ${slayers.slayers.enderman.level} (${formatNumber(slayers.slayers.enderman.xp)})`,
            `Blaze ${slayers.slayers.blaze.level} (${formatNumber(slayers.slayers.blaze.xp)})`,
            `Vamp ${slayers.slayers.vampire.level} (${formatNumber(slayers.slayers.vampire.xp)})`
        ].join(" - ")}`, bridge, "Failed to send slayer message", bot.name);
    }
} as BotEvent;