import { removeItem } from "../../../util/arrays.ts";
import type { BotEvent } from "../../../utils.ts";
import { Scramble } from "../game/scramble.ts";

export default {
    id: "chat:commandGame",
    once: false,
    regex: /^(Guild|Officer) > (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?[gG][aA][mM][eE](?: ([rR][eE][mM][iI][nN][dD](?:[eE][rR])?))?$/,
    run: async (
        bridge,
        bot,
        type: "Guild" | "Officer",
        rank: string | undefined,
        author: string,
        guildRank: string | undefined,
        bridgeAuthor: string | undefined,
        reminder?: string
    ) => {
        if (bridgeAuthor && bridgeAuthor.startsWith(bridge.BRIDGE_CHAR)) return;
        
        if (!guildRank) return;

        if (
            bridgeAuthor || (
                guildRank !== "[STAFF]" &&
                guildRank !== "[GM]"
            )
        ) {
            if (bot.scramble === null) {
                if (bot.gameVote.users.includes(bridgeAuthor || author)) return;
                bot.gameVote.users.push(bridgeAuthor || author);
                bot.gameVote.timeouts.push(setTimeout((name) => {
                    removeItem(bot.gameVote.users, name);
                }, 60 * 1000, bridgeAuthor || author));
                if (bot.gameVote.users.length < 3) return;
                bot.gameVote.users = [];
                for (const timeout of bot.gameVote.timeouts) clearTimeout(timeout);
            }
        }

        await Scramble(bot, bridge, type, reminder !== undefined && ( reminder?.toLowerCase() === "remind" || reminder?.toLowerCase() === "reminder" ));
    }
} as BotEvent;