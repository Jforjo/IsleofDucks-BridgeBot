import { nanoid } from "nanoid/non-secure";
import type { BotEvent } from "../../../utils.ts";

export default {
    id: "chat:commandCF",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?[cC][fF]$/,
    run: (
        bridge,
        bot,
        type: "Guild >" | "Officer >" | "From",
        rank: string | undefined,
        author: string,
        guildRank: string | undefined,
        bridgeAuthor: string | undefined,
    ) => {
        if (bridgeAuthor && bridgeAuthor.startsWith(bridge.BRIDGE_CHAR)) return;
        
        const channel =
            type === "Officer >" ? "/oc" :
            type === "From" ? `/msg ${author}` :
            "/gc"
        ;
        bot.chat(`${channel} ${Math.random() < 0.5 ? "Heads" : "Tails"} (${nanoid(8)})`, bridge, "Failed to send coin flip message", bot.name);
    }
} as BotEvent;