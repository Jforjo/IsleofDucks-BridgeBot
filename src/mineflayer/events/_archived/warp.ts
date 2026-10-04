import type { BotEvent } from "../../../utils.ts";

export default {
    id: "chat:commandWarp",
    once: false,
    regex: /^(Guild|Officer) > (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?[wW][aA][rR][pP] (\w{2,17})$/,
    run: async (
        bridge,
        bot,
        type: "Guild" | "Officer",
        rank: string | undefined,
        author: string,
        guildRank: string | undefined,
        bridgeAuthor: string | undefined,
        target: string
    ) => {
        if (bridgeAuthor && bridgeAuthor.startsWith(bridge.BRIDGE_CHAR)) return;
        
        const channel = type === "Officer" ? "/oc" : "/gc";
        return bot.chat(`${channel} The warp command has been temporarily disabled under the slight suspicion that it's banning the bots.`, bridge, "Failed to send warp disabled message", bot.name);
        if (bot.warps[target.toLowerCase()]) {
            return bot.chat(`${channel} ${author}, I'm already warping ${target}.`, bridge, "Failed to send already warping message", bot.name);
        }
        if (type !== "Officer") {
            if (Object.values(bridge.warpCooldowns).find((cd) => cd.author === author))
                return bot.chat(`${channel} ${author}, there's a cooldown between warps.`, bridge, "Failed to send warp cooldown message", bot.name);
            if (Object.keys(bridge.warpCooldowns).includes(target.toLowerCase()))
                return bot.chat(`${channel} Warping ${target} is on cooldown.`, bridge, "Failed to send target warp cooldown message", bot.name);
            bridge.addWarpCooldown(target, author);
        }
        bot.chat(`${channel} Attempting to warp ${target}`, bridge, "Failed to send attempting to warp message", bot.name);
        bot.warps[target.toLowerCase()] = { channel, status: "waitingtoinvite" };
        await bot.continueWarps(bridge);
    }
} as BotEvent;