import getItems from "../../../requests/items.ts";
import type { BotEvent } from "../../../utils.ts";
import type Bridge from "../../../bridge.ts";
import type Mineflayer from "../../mineflayer.ts";

function scrambleString(str: string): string {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // Retry if starts or ends with a space
    if (arr[0] === ' ' || arr[arr.length - 1] === ' ') return scrambleString(str);
    // Retry if there are 2 spaces next to eachother
    for (let i = 1; i < arr.length - 2; i++) {
        if (arr[i] === ' ' && arr[i + 1] === ' ') return scrambleString(str);
    }
    return arr.join('');
}

function unscrambleSpaces(scrambled: string, answer: string): string {
    // Extract the positions of spaces in the answer
    const spacePositions = [...answer]
        .map((ch, i) => (ch === " " ? i : -1))
        .filter(i => i !== -1);

    // Remove all spaces from the scrambled string
    const letters = scrambled.replace(/ /g, "").split("");

    // Reinsert spaces at the correct positions
    for (const pos of spacePositions) {
        letters.splice(pos, 0, " ");
    }

    return letters.join("");
}

export async function Scramble(bot: Mineflayer, bridge: Bridge, type: "Guild" | "Officer", reminder: boolean): Promise<void> {
    if (
        ( type === "Guild" && bridge.combined.guild ) ||
        ( type === "Officer" && bridge.combined.officer )
    ) {
        bot = bridge.mineflayerDuck;
    }
    const channel = type === "Officer" ? "/oc" : "/gc";

    if (bot.scramble) {
        if (reminder) {
            return bot.chat(`${channel} Reminder of current Scramble: "${bot.scramble.scrambled}" (Guess with "g [guess]" | Hint at 15mins)`, bridge, "Failed to send Scramble reminder message", bot.name);
        }
        return bot.chat(`${channel} A scramble is already active!`, bridge, "Failed to send Scramble already active message", bot.name);
    }

    const items = await getItems();
    if (!items.success) return bot.chat(`${channel} ${items.message}`, bridge, "Failed to send Scramble error message", bot.name);
    if (!items.items) return bot.chat(`${channel} Didn't recieve any items from the API call`, bridge, "Failed to send Scramble error message", bot.name);
    
    const randItem = items.items[Math.floor(Math.random() * items.items.length)];
    // Should never run, blame TS
    // if (!randItem) return bot.chat(`${channel} Selected item has no name`, bridge, "Failed to send Scramble error message", bot.name);
    const randItemName = randItem.toLowerCase();
    const scrambledName = scrambleString(randItemName);

    bot.chat(`${channel} Scrambled Item: "${scrambledName}" (Guess with "g [guess]" | Hint at 15mins)`, bridge, "Failed to send Scramble message", bot.name);

    bot.scramble = {
        scrambled: scrambledName,
        answer: randItemName,
        hintTimeout: setTimeout(() => {
            if (bot.scramble && bot.scramble.answer === randItemName) {
                bot.scramble.scrambled = unscrambleSpaces(bot.scramble.scrambled, bot.scramble.answer);
                bot.chat(`${channel} Hint: The spaces have been unscrambled! "${bot.scramble.scrambled}"`, bridge, "Failed to send Scramble hint message", bot.name);
            }
        }, 15 * 60 * 1000),
        endTimeout: setTimeout(() => {
            if (bot.scramble && bot.scramble.answer === randItemName) {
                bot.chat(`${channel} Time's up! The answer was "${bot.scramble.answer}"`, bridge, "Failed to send Scramble timeout message", bot.name);
                bot.scramble = null;
            }
        }, 30 * 60 * 1000)
    };
}

export default {
    id: "chat:commandScramble",
    once: false,
    regex: /^(Guild|Officer) > (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!scramble(?: (reminder))?$/,
    run: async (
        bridge,
        bot,
        type: "Guild" | "Officer",
        rank: string | undefined,
        author: string,
        guildRank: string | undefined,
        bridgeAuthor: string | undefined,
        reminder?: string
    ) => {
        if (bridgeAuthor) return;
        
        if (reminder !== "reminder") {
            if (!guildRank || (
                guildRank !== "[STAFF]" &&
                guildRank !== "[GM]"
            )) return;
        }

        await Scramble(bot, bridge, type, reminder === "reminder");
    }
} as BotEvent;