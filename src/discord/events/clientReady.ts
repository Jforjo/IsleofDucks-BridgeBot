import type { TextChannel } from "discord.js";
import type { BotEvent } from "../../utils.ts"

const channelIds = {
    welcome: "823073976166383636", // General
    duck: "1166902582464237658",
    duckling: "1166891695774904410",
    duckoc: "1166902454496006196",
    ducklingoc: "1166900860224294932",
    combined: "1402532834551533649",
    combinedoc: "1402532881753968722",
    counting: "993685988582895677",
    guesstowin: "1132372503193473055",
    memberJoinLeave: "1096889421871202485",
    banLog: "903871143662993408"
}

export default {
    id: "clientReady",
    once: true,
    run: async (bridge, _bot) => {
        bridge.setStatus();
        
        bridge.welcomeChannel = bridge.discord.channels.cache.get(channelIds.welcome) as TextChannel;
        if (!bridge.welcomeChannel) bridge.welcomeChannel = (await bridge.discord.channels.fetch(channelIds.welcome)) as TextChannel;
        if (!bridge.welcomeChannel) bridge.logger.log("log_error", `[DISCORD] Guild channel ${channelIds.welcome} not found!`);
        
        bridge.countingChannel = bridge.discord.channels.cache.get(channelIds.counting) as TextChannel;
        if (!bridge.countingChannel) bridge.countingChannel = (await bridge.discord.channels.fetch(channelIds.counting)) as TextChannel;
        if (!bridge.countingChannel) bridge.logger.log("log_error", `[DISCORD] Guild channel ${channelIds.counting} not found!`);
        
        bridge.guesstowinChannel = bridge.discord.channels.cache.get(channelIds.guesstowin) as TextChannel;
        if (!bridge.guesstowinChannel) bridge.guesstowinChannel = (await bridge.discord.channels.fetch(channelIds.guesstowin)) as TextChannel;
        if (!bridge.guesstowinChannel) bridge.logger.log("log_error", `[DISCORD] Guild channel ${channelIds.guesstowin} not found!`);
        
        bridge.memberJoinLeaveChannel = bridge.discord.channels.cache.get(channelIds.memberJoinLeave) as TextChannel;
        if (!bridge.memberJoinLeaveChannel) bridge.memberJoinLeaveChannel = (await bridge.discord.channels.fetch(channelIds.memberJoinLeave)) as TextChannel;
        if (!bridge.memberJoinLeaveChannel) bridge.logger.log("log_error", `[DISCORD] Guild channel ${channelIds.memberJoinLeave} not found!`);
        
        bridge.banLogChannel = bridge.discord.channels.cache.get(channelIds.banLog) as TextChannel;
        if (!bridge.banLogChannel) bridge.banLogChannel = (await bridge.discord.channels.fetch(channelIds.banLog)) as TextChannel;
        if (!bridge.banLogChannel) bridge.logger.log("log_error", `[DISCORD] Guild channel ${channelIds.banLog} not found!`);


        bridge.mineflayerDuck.guildChannel = bridge.discord.channels.cache.get(channelIds.duck) as TextChannel;
        if (!bridge.mineflayerDuck.guildChannel) bridge.mineflayerDuck.guildChannel = (await bridge.discord.channels.fetch(channelIds.duck)) as TextChannel;
        if (!bridge.mineflayerDuck.guildChannel) bridge.logger.log("log_error", `[DISCORD] Guild channel ${channelIds.duck} not found!`);
        
        bridge.mineflayerDuck.officerChannel = bridge.discord.channels.cache.get(channelIds.duckoc) as TextChannel;
        if (!bridge.mineflayerDuck.officerChannel) bridge.mineflayerDuck.officerChannel = (await bridge.discord.channels.fetch(channelIds.duckoc)) as TextChannel;
        if (!bridge.mineflayerDuck.officerChannel) bridge.logger.log("log_error", `[DISCORD] Guild channel ${channelIds.duckoc} not found!`);

        bridge.mineflayerDuckling.guildChannel = bridge.discord.channels.cache.get(channelIds.duckling) as TextChannel;
        if (!bridge.mineflayerDuckling.guildChannel) bridge.mineflayerDuckling.guildChannel = (await bridge.discord.channels.fetch(channelIds.duckling)) as TextChannel;
        if (!bridge.mineflayerDuckling.guildChannel) bridge.logger.log("log_error", `[DISCORD] Guild channel ${channelIds.duckling} not found!`);
        
        bridge.mineflayerDuckling.officerChannel = bridge.discord.channels.cache.get(channelIds.ducklingoc) as TextChannel;
        if (!bridge.mineflayerDuckling.officerChannel) bridge.mineflayerDuckling.officerChannel = (await bridge.discord.channels.fetch(channelIds.ducklingoc)) as TextChannel;
        if (!bridge.mineflayerDuckling.officerChannel) bridge.logger.log("log_error", `[DISCORD] Guild channel ${channelIds.ducklingoc} not found!`);

        
        bridge.combinedGuildChannel = bridge.discord.channels.cache.get(channelIds.combined) as TextChannel;
        if (!bridge.combinedGuildChannel) bridge.combinedGuildChannel = (await bridge.discord.channels.fetch(channelIds.combined)) as TextChannel;
        if (!bridge.combinedGuildChannel) bridge.logger.log("log_error", `[DISCORD] Guild channel ${channelIds.combined} not found!`);
        
        bridge.combinedOfficerChannel = bridge.discord.channels.cache.get(channelIds.combinedoc) as TextChannel;
        if (!bridge.combinedOfficerChannel) bridge.combinedOfficerChannel = (await bridge.discord.channels.fetch(channelIds.combinedoc)) as TextChannel;
        if (!bridge.combinedOfficerChannel) bridge.logger.log("log_error", `[DISCORD] Guild channel ${channelIds.combinedoc} not found!`);

        bridge.updateCombined();
    }
} as BotEvent;