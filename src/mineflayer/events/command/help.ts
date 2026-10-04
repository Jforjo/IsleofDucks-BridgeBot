import { readdir } from "fs/promises";
import type { BotEvent } from "../../../utils.ts";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
    id: "chat:commandHelp",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?[hH][eE][lL][pP](?: ([cC][oO][mM][mM][aA][nN][dD][sS]?))?$/,
    run: async (
        bridge,
        bot,
        type: "Guild >" | "Officer >" | "From",
        rank: string | undefined,
        author: string,
        guildRank: string | undefined,
        bridgeAuthor: string | undefined,
        param?: string
    ) => {
        if (bridgeAuthor && bridgeAuthor.startsWith(bridge.BRIDGE_CHAR)) return;
        
        const channel =
            type === "Officer >" ? "/oc" :
            type === "From" ? `/msg ${author}` :
            "/gc"
        ;

        if (!param) return bot.chat(`${channel} For general support please visit /g discord. For specific commands use !help commands.`, bridge, "Failed to send help message", bot.name);
        // get all file names within the same folder
        const commands = await readdir(__dirname);
        const filteredCommands = commands.filter((command) => command.endsWith(".ts"));
        const commandNames = filteredCommands.map((command) => command.replace(".ts", ""));
        const commandList = commandNames.join(", ");
        bot.chat(`${channel} Available commands: ${commandList}`, bridge, "Failed to send commands list", bot.name);
    }
} as BotEvent;