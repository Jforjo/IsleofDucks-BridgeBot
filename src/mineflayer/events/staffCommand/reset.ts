import type { BotEvent } from "../../../utils.ts";

const ALLOWED_TO_RESET = [
    "J_forjoooooo"
];

export default {
    id: "chat:commandReset",
    once: false,
    regex: /^(Guild|Officer) > (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!reset ?(.*)?$/,
    run: async (
        bridge,
        bot,
        type: "Guild" | "Officer",
        rank: string | undefined,
        author: string,
        guildRank: string | undefined,
        bridgeAuthor: string | undefined,
        reason?: string
    ) => {
        if (bridgeAuthor && bridgeAuthor.startsWith(bridge.BRIDGE_CHAR)) return;
        
        if (!ALLOWED_TO_RESET.includes(author)) return;
        // if (!ALLOWED_TO_RESET.includes(bridgeAuthor || author)) return;

        if (reason === "duck") {
            bridge.mineflayerDuck.reconnecting = 0;
            try {
                bridge.mineflayerDuck.bot.quit();
            } catch {};
            await bridge.mineflayerDuck.reconnectOrExit(bridge);
            return;
        } else if (reason === "duckling") {
            bridge.mineflayerDuckling.reconnecting = 0;
            try {
                bridge.mineflayerDuckling.bot.quit();
            } catch {}
            await bridge.mineflayerDuckling.reconnectOrExit(bridge);
            return;
        }

        const channel = type === "Officer" ? "/oc" : "/gc";
        const message = `${channel} ${author} initiated a manual reset of the bots${reason ? ` with reason: ${reason.replace("FULL ", "")}` : "."}`;
        bridge.mineflayerDuck.chat(message, bridge, "Failed to send reset message", "duck");
        bridge.mineflayerDuckling.chat(message, bridge, "Failed to send reset message", "duckling");
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (reason?.startsWith("FULL")) process.exit(0);
        bridge.mineflayerDuck.bot.quit();
        bridge.mineflayerDuckling.bot.quit();
        await bridge.mineflayerDuck.reconnectOrExit(bridge);
        await bridge.mineflayerDuckling.reconnectOrExit(bridge);
    }
} as BotEvent;