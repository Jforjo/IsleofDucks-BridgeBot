import type { BotEvent } from "../../../utils.ts";
import getWeeklyGxp from "../../../requests/weeklyGxp.ts";

export default {
    id: "chat:commandGXP",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?[gG][eE]?[xX][pP](?: (\w{2,17}))?$/,
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

        const gxp = await getWeeklyGxp(target || bridgeAuthor || author);
        if (!gxp.success) {
            return bot.chat(`${channel} ${gxp.message}`, bridge, "Failed to send GXP error message", bot.name);
        }
        bot.chat(`${channel} ${gxp.username}'s weekly GEXP: ${gxp.gxp} #${gxp.rank} (joined ${gxp.guildName} on ${gxp.memberJoinedGuild.toLocaleDateString("en-gb", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })})`, bridge, "Failed to send GXP message", bot.name);
                }
} as BotEvent;