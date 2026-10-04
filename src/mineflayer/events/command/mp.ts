import type { BotEvent } from "../../../utils.ts";
import getMagicPower from "../../../requests/mp.ts";

export default {
    id: "chat:commandMP",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?(?:[mM][pP]|[aA][pP])(?: (\w{2,17}))?$/,
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

        const magicPower = await getMagicPower(target || bridgeAuthor || author);
        if (!magicPower.success) {
            return bot.chat(`${channel} ${magicPower.message}`, bridge, "Failed to send MP error message", bot.name);
        }
        bot.chat(`${channel} ${magicPower.username}'s AP: ${magicPower.magicPower}${magicPower.selectedPower ? ` (${magicPower.selectedPower})` : ""}`, bridge, "Failed to send MP message", bot.name);
    }
} as BotEvent;