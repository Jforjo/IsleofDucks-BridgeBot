import type { BotEvent } from "../../../utils.ts";
import getUsernameOrUUID from "../../../requests/uuid.ts";
import getPlayer from "../../../requests/player.ts";

export default {
    id: "chat:commandGrass",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?[gG][rR][aA][sS][sS](?: (\w{2,17}))?$/,
    run: async (
        bridge,
        bot,
        type: "Guild >" | "Officer >" | "From",
        rank: string | undefined,
        author: string,
        guildRank: string | undefined,
        bridgeAuthor: string | undefined,
        target?: string
    ) => {
        if (bridgeAuthor && bridgeAuthor.startsWith(bridge.BRIDGE_CHAR)) return;
        
        const channel =
            type === "Officer >" ? "/oc" :
            type === "From" ? `/msg ${author}` :
            "/gc"
        ;

        const user = await getUsernameOrUUID(target || bridgeAuthor || author);
        if (!user.success) {
            return bot.chat(`${channel} ${user.message}`, bridge, "Failed to send grass error message", bot.name);
        }

        const player = await getPlayer(user.uuid);
        if (!player.success) {
            return bot.chat(`${channel} ${player.message}`, bridge, "Failed to send grass error message", bot.name);
        }
        
        const lastLogin = player.player.lastLogin;
        if (!lastLogin) {
            return bot.chat(`${channel} ${user.name} has never logged in.`, bridge, "Failed to send grass message", bot.name);
        }
        const lastLogout = player.player.lastLogout;
        if (!lastLogout) {
            return bot.chat(`${channel} ${user.name} is touching grass.`, bridge, "Failed to send grass message", bot.name);
        }

        if (lastLogout >= lastLogin) {
            const lastLogoutDate = new Date(lastLogout);
            const diffMs = Date.now() - lastLogoutDate.getTime();

            const seconds = Math.floor(diffMs / 1000) % 60;
            const minutes = Math.floor(diffMs / (1000 * 60)) % 60;
            const hours = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            const parts = [];

            if (days) parts.push(`${days}d`);
            if (hours) parts.push(`${hours}h`);
            if (minutes) parts.push(`${minutes}m`);
            if (!days && !hours && !minutes && seconds) parts.push(`${seconds}s`);

            return bot.chat(`${channel} ${user.name} has been touching grass for ${parts.join(" ")}.`, bridge, "Failed to send grass message", bot.name);
        }

        const lastLoginDate = new Date(lastLogin);
        const diffMs = Date.now() - lastLoginDate.getTime();

        const seconds = Math.floor(diffMs / 1000) % 60;
        const minutes = Math.floor(diffMs / (1000 * 60)) % 60;
        const hours = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        const parts = [];
        // if (days) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
        // if (hours) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
        // if (minutes) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
        // if (seconds) parts.push(`${seconds} second${seconds !== 1 ? "s" : ""}`);
        if (days) parts.push(`${days}d`);
        if (hours) parts.push(`${hours}h`);
        if (minutes) parts.push(`${minutes}m`);
        if (!days && !hours && !minutes && seconds) parts.push(`${seconds}s`);

        const time = parts.join(" ");
        // if (parts.length === 1) {
        //     time = `${parts[0]}`;
        // } else if (parts.length === 2) {
        //     time = `${parts[0]} and ${parts[1]}`;
        // } else if (parts.length > 2) {
        //     time = `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
        // }

        if (hours < 1) {
            bot.chat(`${channel} ${user.name}'s been online for ${time}. They're not touching grass.`, bridge, "Failed to send grass message", bot.name);
        } else if (hours < 2) {
            bot.chat(`${channel} ${user.name}'s been online for ${time}. You should probably touch some grass.`, bridge, "Failed to send grass message", bot.name);
        } else if (hours < 4) {
            bot.chat(`${channel} ${user.name}'s been online for ${time}. It's time to touch some grass.`, bridge, "Failed to send grass message", bot.name);
        } else if (hours < 6) {
            bot.chat(`${channel} ${user.name}'s been online for ${time}. Go touch some grass!`, bridge, "Failed to send grass message", bot.name);
        } else if (hours < 8) {
            bot.chat(`${channel} ${user.name}'s been online for ${time}. Seriously, go touch some grass!!!`, bridge, "Failed to send grass message", bot.name);
        } else if (hours < 12) {
            bot.chat(`${channel} ${user.name}'s been online for ${time}. GO TOUCH GRASS!!!!!`, bridge, "Failed to send grass message", bot.name);
        } else if (hours < 24) {
            bot.chat(`${channel} ${user.name}'s been online for ${time}. TOUCH GRASS NOW!!!!!!!!`, bridge, "Failed to send grass message", bot.name);
        } else {
            bot.chat(`${channel} ${user.name}'s been online for ${time}. GRAAASSSSSSSSSSSS!!!!!!!!!!!!`, bridge, "Failed to send grass message", bot.name);
        }
    }
} as BotEvent;