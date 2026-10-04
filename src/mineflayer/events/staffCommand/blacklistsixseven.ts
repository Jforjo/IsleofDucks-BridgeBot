import type { BotEvent } from "../../../utils.ts";

export default {
    id: "chat:command67",
    once: false,
    regex: /^(Guild|Officer) > (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?(?:(?:[sS]+[iI]+[xX]+ ?[sS]+[eE]+[vV]+[eE]+[nN]+)|(?:6+ ?7+))!*$/,
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
        bot.chat(`/g mute ${author} 2m`, bridge, "Failed to send mute command for 67", bot.name);
    }
} as BotEvent;