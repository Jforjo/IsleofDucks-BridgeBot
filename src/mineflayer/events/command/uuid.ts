import type { BotEvent } from "../../../utils.ts";
import getUsernameOrUUID from "../../../requests/uuid.ts";

export default {
    id: "chat:commandUUID",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?[uU][uU][iI][dD](?: (\w{2,17}))?$/,
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

        const username = await getUsernameOrUUID(target || bridgeAuthor || author);
        if (!username.success) {
            return bot.chat(`${channel} ${username.message}`, bridge, "Failed to send UUID error message", bot.name);
        }
        bot.chat(`${channel} ${username.name}'s UUID: ${username.uuid}`, bridge, "Failed to send UUID message", bot.name);
    }
} as BotEvent;