import type { BotEvent } from "../../../utils.ts";
import getStatus from "../../../requests/status.ts";
import { capataliseFirstLetter } from "../../../util/format.ts";

export default {
    id: "chat:commandStalk",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?[sS][tT][aA][lL][kK](?: (\w{2,17}))?$/,
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

        const status = await getStatus(target || bridgeAuthor || author);
        if (!status.success) {
            return bot.chat(`${channel} ${status.message}`, bridge, "Failed to send stalk error message", bot.name);
        }

        if (status.session?.mode === "LOBBY") {
            if (status.session?.gameType) {
                return bot.chat(`${channel} ${status.username}'s location: ${capataliseFirstLetter(status.session.gameType)} lobby.`, bridge, "Failed to send stalk message", bot.name);
            }
            return bot.chat(`${channel} ${status.username}'s location: Lobby.`, bridge, "Failed to send stalk message", bot.name);
        } else if (status.session?.gameType) {
            if (status.session.gameType === "SKYBLOCK") {
                if (!status.session.mode) {
                    return bot.chat(`${channel} ${status.username}'s location: SkyBlock.`, bridge, "Failed to send stalk message", bot.name);
                }

                const island = status.session.mode === "dynamic" ? "Private Island" : capataliseFirstLetter(status.session.mode);
                return bot.chat(`${channel} ${status.username}'s location: SkyBlock (${island}).`, bridge, "Failed to send stalk message", bot.name);
            } else {
                return bot.chat(`${channel} ${status.username}'s location: ${capataliseFirstLetter(status.session.gameType)}${status.session.mode ? ` (${status.session.mode})` : ""}${status.session.map ? ` on the map: "${status.session.map}"` : ""}.`, bridge, "Failed to send stalk message", bot.name);
            }
        }
        bot.chat(`${channel} ${status.username} is offline.`, bridge, "Failed to send stalk message", bot.name);
    }
} as BotEvent;