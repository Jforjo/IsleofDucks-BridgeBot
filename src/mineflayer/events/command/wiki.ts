import type { BotEvent } from "../../../utils.ts";
import { capataliseFirstLetter, messageFilter } from "../../../util/format.ts";

export default {
    id: "chat:commandWiki",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?[wW][iI][kK][iI](?: (.*))?$/,
    run: async (
        bridge,
        bot,
        type: "Guild >" | "Officer >" | "From",
        rank: string | undefined,
        author: string,
        guildRank: string | undefined,
        bridgeAuthor: string | undefined,
        text?: string
    ) => {
        if (bridgeAuthor && bridgeAuthor.startsWith(bridge.BRIDGE_CHAR)) return;
        
        const channel =
            type === "Officer >" ? "/oc" :
            type === "From" ? `/msg ${author}` :
            "/gc"
        ;

        const wikiUrl = "https://hypixelskyblock.minecraft.wiki";
        if (!text) return bot.chat(`${channel} ${wikiUrl}`, bridge, "Failed to send wiki link", bot.name);
        const messageFiltered = messageFilter(text, bridge.chatFilters);
        const formattedText = encodeURIComponent(messageFiltered.split(" ").map(word => capataliseFirstLetter(word)).join("_"));
        bot.chat(`${channel} ${wikiUrl}/w/${formattedText}`, bridge, "Failed to send wiki link", bot.name);

        // bot.chat(`${channel} The wiki command has been disabled with the discontinuation of the official wiki: https://hypixel.net/threads/end-of-the-official-hypixel-wiki-july-21.6112020/`, bridge, "Failed to send wiki link", bot.name);
    }
} as BotEvent;