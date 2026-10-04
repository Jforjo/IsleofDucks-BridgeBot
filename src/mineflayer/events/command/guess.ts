import { updateScrambleScore } from "../../../requests/scramble.ts";
import type { BotEvent } from "../../../utils.ts";

export default {
    id: "chat:commandGuess",
    once: false,
    regex: /^(Guild|Officer) > (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?[gG](?:[uU][eE][sS][sS])? (.*)$/,
    run: async (
        bridge,
        bot,
        type: "Guild" | "Officer",
        rank: string | undefined,
        author: string,
        guildRank: string | undefined,
        bridgeAuthor: string | undefined,
        guess: string
    ) => {
        if (bridgeAuthor && bridgeAuthor.startsWith(bridge.BRIDGE_CHAR)) return;
        
        const channel = type === "Officer" ? "/oc" : "/gc";
        // if (author === bot.bot._client.username) return;
    
        if (channel === "/oc") return bot.chat(`/oc Scrambles can only be guessed in guild chat!`, bridge, "Failed to send wrong channel message", bot.name);

        if (bridge.combined.guild) {
            // if (!bridge.mineflayerDuck.scramble) return bot.chat(`${channel} There is no active scramble!`, bridge, "Failed to send no scramble message", bot.name);
            if (!bridge.mineflayerDuck.scramble) return;

            if (guess.toLowerCase() === bridge.mineflayerDuck.scramble.answer) {
                bot.chat(`/gc Correct! ${bridgeAuthor || author} guessed correctly with "${bridge.mineflayerDuck.scramble.answer}"!`, bridge, "Failed to send correct guess message", bot.name);
                bridge.mineflayerDuck.scramble = null;
                const updateScoreRes = await updateScrambleScore(bridgeAuthor || author);
                if (!updateScoreRes.success) {
                    bridge.logger.log("log_error", `Failed to update scramble score for ${bridgeAuthor || author}: ${updateScoreRes.message}`);
                }
            }
        } else {
            // if (!bot.scramble) return bot.chat(`${channel} There is no active scramble!`, bridge, "Failed to send no scramble message", bot.name);
            if (!bot.scramble) return;

            if (guess.toLowerCase() === bot.scramble.answer) {
                bot.chat(`/gc Correct! ${bridgeAuthor || author} guessed correctly with "${bot.scramble.answer}"!`, bridge, "Failed to send correct guess message", bot.name);
                bot.scramble = null;
                const updateScoreRes = await updateScrambleScore(bridgeAuthor || author);
                if (!updateScoreRes.success) {
                    bridge.logger.log("log_error", `Failed to update scramble score for ${bridgeAuthor || author}: ${updateScoreRes.message}`);
                }
            }
        }
    }
} as BotEvent;