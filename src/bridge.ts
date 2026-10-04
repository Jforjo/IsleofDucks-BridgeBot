import { ActivityType, IntentsBitField, Role, TextChannel } from "discord.js";
import Discord from "./discord/discord.ts";
import Logger from "./logger.ts";
import Mineflayer from "./mineflayer/mineflayer.ts";
import getChatFilters from "./requests/filters.ts";
import getEmojis from "./requests/emojis.ts";

export default class Bridge {
    constructor() {
        // if (!process.env.MINECRAFT_DUCK_EMAIL || !process.env.MINECRAFT_DUCK_PASSWORD || !process.env.MINECRAFT_DUCKLING_EMAIL || !process.env.MINECRAFT_DUCKLING_PASSWORD) {
        //     console.log("Please set the MINECRAFT_DUCK_USERNAME, MINECRAFT_DUCK_PASSWORD, MINECRAFT_DUCKLING_USERNAME and MINECRAFT_DUCKLING_PASSWORD environment variables.");
        //     throw new Error("Missing environment variables for Minecraft Duck and Duckling accounts.");
        // }
        // if (!process.env.MINECRAFT_DUCK_EMAIL || !process.env.MINECRAFT_DUCK_PASSWORD) {
        //     console.log("Please set the MINECRAFT_DUCK_EMAIL and MINECRAFT_DUCK_PASSWORD environment variables.");
        //     throw new Error("Missing environment variables for Minecraft Duck accounts.");
        // }
        // this.mineflayerDuck = new Mineflayer("duck", 3001, {
        //     host: "mc.hypixel.net",
        //     version: "1.8.9",
        //     username: "MangoMilkshake",
        //     auth: "microsoft"
        // });
        this.mineflayerDuck = new Mineflayer("duck", 3001, {
            host: "mc.hypixel.net",
            version: "1.8.9",
            username: "IsleofDuckBridge",
            auth: "microsoft",
            checkTimeoutInterval: 60000,
            physicsEnabled: false
        });
        this.mineflayerDuckling = new Mineflayer("duckling", 3002, {
            host: "mc.hypixel.net",
            version: "1.8.9",
            username: "IsleofDucklings",
            auth: "microsoft",
            checkTimeoutInterval: 60000,
            physicsEnabled: false

        });
        this.mineflayerHatchling = new Mineflayer("hatchling", 3003, {
            host: "mc.hypixel.net",
            version: "1.8.9",
            username: "DuckiePrincess",
            auth: "microsoft",
            checkTimeoutInterval: 60000,
            physicsEnabled: false
        })
        try {
            this.start();
        } catch (error) {
            this.logger.log("log_error", "Failed to start the bridge:", error);
        }
    }
    public readonly discord = new Discord({
        intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMembers,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.MessageContent,
            IntentsBitField.Flags.GuildModeration
        ]
    });
    public welcomeChannel?: TextChannel;
    public countingChannel?: TextChannel;
    public guesstowinChannel?: TextChannel;
    public memberJoinLeaveChannel?: TextChannel;
    public banLogChannel?: TextChannel;

    public guesstowin: {
        data: {
            id: string;
            winner: string | null;
            hints: {
                hint: string;
                at: number;
            }[];
            prize: string | null;
            answer: string;
            guesses: number;
            started: number;
            ended: number | null;
            sponsor: string | null;
        } | null;
        guesses: number;
        prevGuesses: number;
        interval: ReturnType<typeof setInterval> | null;
    } = {
        data: null,
        guesses: 0,
        prevGuesses: 0,
        interval: null
    };

    public readonly mineflayerDuck: Mineflayer;
    public readonly mineflayerDuckling: Mineflayer;
    public readonly mineflayerHatchling: Mineflayer;
    public readonly GUILD_ID = "823061629812867113";
    public readonly BRIDGE_CHAR = '˚';
    public updatingRoles = false;

    public combinedGuildChannel?: TextChannel;
    public combinedOfficerChannel?: TextChannel;
    public combinedGuild = false;
    public combinedOfficer = false;
    public get combined() {
        return {
            guild: this.combinedGuild,
            officer: this.combinedOfficer
        };
    }
    public set combined({ guild, officer }: { guild?: boolean; officer?: boolean }) {
        if (guild) this.combinedGuild = guild;
        if (officer) this.combinedOfficer = officer;
    }
    public async updateCombined() {
        if (!this.combinedGuildChannel || !this.combinedOfficerChannel) return;

        this.combined = {
            guild: this.combinedGuildChannel.permissionOverwrites.cache.size > 1,
            officer: this.combinedOfficerChannel.permissionOverwrites.cache.size > 1
        }
    }

    public readonly logger = new Logger([
        {
            event: "chat_input_duck",
            listener: (msg: string) => {
                this.mineflayerDuck.bot.chat(msg);
            }
        },
        {
            event: "chat_input_duckling",
            listener: (msg: string) => {
                this.mineflayerDuckling.bot.chat(msg);
            }
        },
        {
            event: "chat_input_duckieprincess",
            listener: (msg: string) => {
                this.mineflayerHatchling.bot.chat(msg);
            }
        }
    ]);

    public warpCooldowns: Record<string, {
        author: string;
        ends: number;
        autoRemove: NodeJS.Timeout;
    }> = {};
    public addWarpCooldown(name: string, author: string) {
        const cd = 5 * 60 * 1000;
        const autoRemover = setTimeout(() => {
            delete this.warpCooldowns[name];
        }, cd);
        this.warpCooldowns[name] = {
            author,
            ends: Date.now() + cd,
            autoRemove: autoRemover
        };
    }

    public emojis: Record<string, string> = {};
    public async updateEmojis() {
        const emojis = await getEmojis();
        if (emojis.success) {
            this.chatFilters = emojis.emojis.reduce((acc, filter) => {
                acc[filter.replacetext] = filter.withtext;
                return acc;
            }, {} as Record<string, string>);
        } else {
            this.logger.log("log_error", `Failed to update emojis: ${emojis.message}`);
        }
    }

    public chatFilters: Record<string, string> = {};
    public async updateChatFilters() {
        const filters = await getChatFilters();
        if (filters.success) {
            this.chatFilters = filters.filters.reduce((acc, filter) => {
                acc[filter.replacetext] = filter.withtext;
                return acc;
            }, {} as Record<string, string>);
        } else {
            this.logger.log("log_error", `Failed to update chat filters: ${filters.message}`);
        }
    }

    public setStatus() {
        if (this.discord.isReady()) {
            this.discord.user.setActivity(
                [
                    `${this.mineflayerDuck.onlineCount}/${this.mineflayerDuck.totalCount} Ducks`,
                    `${this.mineflayerDuckling.onlineCount}/${this.mineflayerDuckling.totalCount} Ducklings`
                ].join(' & '),
                {
                    type: ActivityType.Watching,
                }
            );
        }
    }

    private async start() {
        await Promise.all([
            this.discord.loadEvents(this),
            this.mineflayerDuck.loadHandlerEvents(this),
            this.mineflayerDuckling.loadHandlerEvents(this),
            this.mineflayerHatchling.loadHandlerEvents(this),
            this.updateChatFilters(),
            this.updateEmojis()
        ]);
        await this.discord.login(process.env.DISCORD_TOKEN);
        await this.updateCombined();
        
        // await new Promise(resolve => setTimeout(resolve, Math.random() * 10000 + 10000)),
    }
}
