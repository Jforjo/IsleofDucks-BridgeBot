import { ComponentType, escapeMarkdown, MessageFlags, type MessageCreateOptions } from 'discord.js';
import { covnertRankToEmojis, getPlusColour, getRankColour, wait, type BotEvent } from '../../../utils.ts';

const whitelist = [
    "J_forjoooooo",
    "Ducksicle",
    "Serendibite",
    "IsleofDuckBridge",
    "IsleofDucklings",
    "DuckiePrincess"
];

export default {
    id: "chat:guildMuteUnmute",
    once: false,
    regex: /^(\[.*])?\s*(\w{2,17}) has (muted|unmuted) (\[.*])?\s*(\w{2,17})(?: for (\d*[a-z]))?$/,
    run: async (
        bridge,
        bot,
        authorRank: string | undefined,
        authorName: string,
        type: "muted" | "unmuted",
        victimRank: string | undefined,
        victimName: string,
        duration: string | undefined
    ) => {
        const colour = getRankColour(authorRank);
        const authorRankEmoji = covnertRankToEmojis(authorRank);
        const victimRankEmoji = covnertRankToEmojis(victimRank);

        const content = {
            flags: MessageFlags.IsComponentsV2,
            components: [
                {
                    type: ComponentType.Container,
                    accent_color: colour,
                    components: [
                        {
                            type: ComponentType.TextDisplay,
                            content: `${authorRankEmoji ? authorRankEmoji + " " : ""}${escapeMarkdown(authorName)} ${type} ${victimRankEmoji ? victimRankEmoji + " " : ""}${escapeMarkdown(victimName)}${duration ? ` for ${duration}` : ''}`
                        }
                    ]
                }
            ]
        } as MessageCreateOptions;
        
        if (bridge.combined.guild === true) await bridge.combinedGuildChannel?.send(content);
        else await bot.guildChannel?.send(content);
        
        if (bridge.combined.officer === true) await bridge.combinedOfficerChannel?.send(content);
        else await bot.officerChannel?.send(content);

        if (type === "muted") {
            const durationNumber = Number(duration?.slice(0, -1)) * (duration?.slice(-1) === "m" ? 60 : duration?.slice(-1) === "h" ? 3600 : 86400);
            bot.setMute(victimName, durationNumber);
            // if (
            //     duration?.slice(-1) === "h" ||
            //     duration?.slice(-1) === "d"
            //     // (
            //     //     duration?.slice(-1) === "m" &&
            //     //     Number(duration?.slice(0, -1)) > 5
            //     // )
            // ) {
            //     // if (!whitelist.includes(authorName)) {
            //         // bot.chat(`/g unmute ${victimName}`, bridge, `Failed to unmute ${victimName}`, bot.name);
            //         // await wait(250);
            //         // bot.chat(`/g mute ${authorName} 30d`, bridge, `Failed to mute ${authorName}`, bot.name);
            //     // }
            // }
        } else if (type === "unmuted") {
            if (
                authorName === victimName 
                // || !whitelist.includes(authorName)
            ) {
                const muteInfo = bot.getMute(victimName);
                if (muteInfo) {
                    const timeLeft = muteInfo.ends - Date.now();
                    const minsLeft = Math.ceil(timeLeft / 60000);
                    bot.chat(`/g mute ${victimName} ${minsLeft}m`, bridge, `Failed to remute ${victimName}`, bot.name);
                }
            } else bot.removeMute(victimName);
        }
    },
} as BotEvent;