import type { BotEvent } from "../../../utils.ts";

export default {
    id: "chat:commandOdinCmds",
    once: false,
    regex: /^(Guild|Officer) > (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!(?:[pP][iI][nN][gG])|(?:[tT][pP][sS])|(?:[fF][pP][sS])|(?:[cC][oO][oO][rR][dD][sS])|(?:[rR][aA][cC][iI][sS][mM])$/,
    run: (
        bridge,
        bot,
        type: "Guild" | "Officer",
        rank: string | undefined,
        author: string,
        guildRank: string | undefined,
        bridgeAuthor: string | undefined,
    ) => {
        if (bridgeAuthor && bridgeAuthor.startsWith(bridge.BRIDGE_CHAR)) return;
        
        if (author == bot.bot._client.username) return;
        bot.chat(`/g mute ${author} 2m`, bridge, "Failed to send mute command for running chat commands", bot.name);
    }
} as BotEvent;