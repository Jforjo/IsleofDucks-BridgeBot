import path from "path";
import type Bridge from "./bridge.ts";
import { fileURLToPath } from "url";
import type Mineflayer from "./mineflayer/mineflayer.ts";

export interface BotEvent {
    id: string;
    once: boolean;
    regex?: RegExp;
    run: (bridge: Bridge, bot: Mineflayer, ...args: any[]) => Promise<void | undefined | {
        type: string,
        message: string
    }> | void | undefined | {
        type: string,
        message: string
    };
}

export type BotName = "duck" | "duckling" | "duckieprincess";

export function getDirname(): string {
    const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
    const __dirname = path.dirname(__filename); // get the name of the directory
    return __dirname
}

const rankEmojis: Record<string, string> = {
    "[VIP]": [
        "<:vip1:1237748665440010310>",
        "<:vip2:1237748666958217267>",
        "<:vip3:1237748668543799318>"
    ].join(""),
    "[VIP+]": [
        "<:vipPlus1:1237748694376382535>",
        "<:vipPlus2:1237748695785537606>",
        "<:vipPlus3:1237748697496817664>"
    ].join(""),
    "[MVP]": [
        "<:mvp1:1237748578114605097>",
        "<:mvp2:1237748579829944401>",
        "<:mvp3:1237748581268721796>"
    ].join(""),
    "[MVP+]": [
        "<:mvpPlus1:1237748607252172903>",
        "<:mvpPlus2:1237748609035014176>",
        "<:mvpPlus3:1237748610263678998>",
        "<:mvpPlus4:1237748612117561364>"
    ].join(""),
    "[MVP++]": [
        "<:mvpPlusPlus1:1237748636734193775>",
        "<:mvpPlusPlus2:1237748638176776304>",
        "<:mvpPlusPlus3:1237748639477137481>",
        "<:mvpPlusPlus4:1237748640525717555>"
    ].join(""),
    "[YOUTUBE]": [
        "<:youtube1:1237748724156076115>",
        "<:youtube2:1237748725976268900>",
        "<:youtube3:1237748727570239569>",
        "<:youtube4:1237748729071665242>",
        "<:youtube5:1237748731034468392>"
    ].join("")
} as const;
export function covnertRankToEmojis(rank?: string): string | undefined {
    if (!rank) return;
    rank = stripColours(rank);
    if (rank in rankEmojis) return rankEmojis[rank];
    return;
}

export function stripColours(text: string): string {
    return text.replace(/§[0-9a-f]/g, "");
}

export function getPlusColour(rank?: string): number | undefined {
    if (!rank) return;
    if (!rank.includes('+')) return;
    const colours = rank.match(/§[0-9a-f]/gm);
    if (!colours) return;
    if (colours.length < 3) return;
    const colour = convertColour(colours[1]);
    if (!colour) return;
    return colour;
}

export function getRankColour(rank?: string): number {
    if (!rank) return 0xAAAAAA;
    if (rank.startsWith("§")) {
        const colour = convertColour(rank.substring(0, 2));
        if (colour) return colour;
    }
    switch (stripColours(rank)) {
        case "[VIP]":
        case "[VIP+]":
            return 0x55FF55;
        case "[MVP]":
        case "[MVP+]":
            return 0x55FFFF;
        case "[MVP++]": return 0xFFAA00;
        case "[YOUTUBE]": return 0xFF5555;
        default: return 0xAAAAAA;
    }
}

export function convertColour(colour: string): number | undefined {
    const match = /^§?([0-9a-f])$/gm.exec(colour);
    if (!match) return;
    switch (match[1]) {
        case "0": return 0x000000;
        case "1": return 0x0000AA;
        case "2": return 0x00AA00;
        case "3": return 0x00AAAA;
        case "4": return 0xAA0000;
        case "5": return 0xAA00AA;
        case "6": return 0xFFAA00;
        case "7": return 0xAAAAAA;
        case "8": return 0x555555;
        case "9": return 0x5555FF;
        case "a": return 0x55FF55;
        case "b": return 0x55FFFF;
        case "c": return 0xFF5555;
        case "d": return 0xFF55FF;
        case "e": return 0xFFFF55;
        case "f": return 0xFFFFFF;
    }
}

export async function wait(ms: number) {
    return new Promise(res => setTimeout(res, ms));
}