import { createBot, type Bot, type BotOptions } from "mineflayer";
import type Bridge from "../bridge.ts";
import loadEvents from "../util/loadevents.ts";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import type { TextChannel } from "discord.js";
import type { BotEvent } from "../utils.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default class Mineflayer {
    private createBot(): Bot {
        return createBot(this.botOptions);
    }

    constructor(name: "duck" | "duckling" | "hatchling", viewerPort: number, options: BotOptions) {
        this.botOptions = options;
        this.bot = this.createBot();
        this.name = name;
        this.viewerPort = viewerPort;
    }
    private botOptions: BotOptions;
    public reconnecting = 1;
    public currentlyReconnecting = true;
    public bot: Bot;
    public onlineCount = 0;
    public totalCount = 125;
    public guildChannel?: TextChannel;
    public officerChannel?: TextChannel;
    public viewerActive = false;
    public events: BotEvent[] = [];
    public name: "duck" | "duckling" | "hatchling";
    public viewerPort: number;
    public location: "limbo" | "lobby" | "skyblock" = "lobby";
    public warps: Record<string, {
        channel: "/gc" | "/oc";
        status: "invited" | "waitingtoinvite" | "joined";
    }> = {};
    public scramble: {
        scrambled: string;
        answer: string;
        hintTimeout: NodeJS.Timeout;
        endTimeout: NodeJS.Timeout;
    } | null = null;
    // public chatLog: string[] = [];
    public gameVote: {
        users: string[];
        timeouts: NodeJS.Timeout[];
    } = {
        users: [],
        timeouts: []
    };

    public chat(message: string, bridge: Bridge, fail: string, context?: string): void {
        if (message.length >= 256) return;
        try {
            this.bot.chat(message);
        } catch (error) {
            bridge.logger.log(`log_error${context ? `_${context}` : ""}`, `${fail}: ${error}`);
        }
    }

    public async continueWarps(bridge: Bridge): Promise<void> {
        if (Object.keys(this.warps).length === 0) {
            if (this.location !== "limbo") this.chat("/limbo", bridge, "Failed to send limbo command", this.name);
            return;
        }
        if (this.location === "limbo") this.chat("/lobby", bridge, "Failed to send lobby command", this.name);
        if (this.location === "lobby") this.chat("/play sb", bridge, "Failed to send play skyblock command", this.name);
        if (this.location !== "skyblock") {
            await new Promise(resolve => setTimeout(resolve, 10000));
            return await this.continueWarps(bridge);
        }
        
        for (const user in this.warps) {
            if (this.warps[user].status === "waitingtoinvite") this.chat(`/p invite ${user}`, bridge, "Failed to send party invite", this.name);
            if (this.warps[user].status === "joined") this.chat(`/p kick ${user}`, bridge, "Failed to send party kick", this.name);
        }
    }

    private mutes: Record<string, {
        ends: number;
        discordId?: string | null;
        autoRemove: NodeJS.Timeout;
    }> = {};

    public getMute(username: string): undefined | typeof this.mutes[string] {
        return username in this.mutes ? this.mutes[username] : undefined;
    }

    public setMute(username: string, duration: number) {
        // const user = await getUsernameOrUUID(username);
        // if (!user.success) return;
        // const uuid = user.uuid;

        const autoRemover = setTimeout(() => {
            delete this.mutes[username];
        }, duration * 1000);
        this.mutes[username] = {
            ends: Date.now() + duration * 1000,
            autoRemove: autoRemover
        };

        // const discordData = await getDiscordData(uuid);
        // if (!discordData.success) return;
        // this.mutes[uuid].discordId = discordData.data.discordid;

        // addMute(this.name, {
        //     discordId: this.mutes[uuid].discordId,
        //     uuid: uuid,
        //     ends: this.mutes[uuid].ends
        // });
    }
    public removeMute(username: string) {
        // const user = await getUsernameOrUUID(username);
        // if (!user.success) return;
        // const uuid = user.uuid;

        if (this.mutes[username]) {
            clearTimeout(this.mutes[username].autoRemove);
            delete this.mutes[username];
            // removeMute(this.name, username);
        }
    }
    public isMuted(username: string): boolean {
        const cleanUsername = username.replace(/[^A-Za-z0-9_]/g, "");
        return cleanUsername in this.mutes;

        // for (const user in this.mutes) {
        //     if (this.mutes[user].discordId === discordId) {
        //         if (this.mutes[user].ends > Date.now()) return true;
        //         this.removeMute(user);
        //         return false;
        //     }
        // }
        // return false;
    }

    public async reconnectOrExit(bridge: Bridge) {
        // if (this.currentlyReconnecting) return;
        // this.currentlyReconnecting = true;
        if (this.reconnecting > 5) {
            console.error("Exiting due to failed reconnect attempt.");
            bridge.logger.log("log_error", "Exiting due to failed reconnect attempt.");
            return;
            // process.exit(1);
        }

        // await new Promise(resolve => setTimeout(resolve, 30000 + (10000 * this.reconnecting)));
        await new Promise(resolve => setTimeout(resolve, 35000));
        // this.currentlyReconnecting = false;
        this.reconnecting++;
        this.bot = this.createBot();
        await this.loadHandlerEvents(bridge);
    }

    public async loadHandlerEvents(bridge: Bridge) {
        await loadEvents(path.join(__dirname, "events/handler"), this.bot, bridge, this);
        bridge.logger.log(`log_info${this.name}`, "Loaded handler events.");
    }
    public async loadMainEvents(bridge: Bridge) {
        await loadEvents(path.join(__dirname, "events/chat"), this.bot, bridge, this);
        bridge.logger.log(`log_info${this.name}`, "Loaded chat events.");
        await loadEvents(path.join(__dirname, "events/command"), this.bot, bridge, this);
        bridge.logger.log(`log_info${this.name}`, "Loaded command events.");
        await loadEvents(path.join(__dirname, "events/staffCommand"), this.bot, bridge, this);
        bridge.logger.log(`log_info${this.name}`, "Loaded staff command events.");
        await loadEvents(path.join(__dirname, "events/party"), this.bot, bridge, this);
        bridge.logger.log(`log_info${this.name}`, "Loaded party events.");
        await loadEvents(path.join(__dirname, "events/game"), this.bot, bridge, this);
        bridge.logger.log(`log_info${this.name}`, "Loaded game events.");
    }
}