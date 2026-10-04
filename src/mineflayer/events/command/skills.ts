import type { BotEvent } from "../../../utils.ts";
import getSkills from "../../../requests/skills.ts";
import { formatNumber } from "../../../util/format.ts";

export default {
    id: "chat:commandSkills",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?[sS](?:[kK][iI][lL][lL][sS]?)?(?: ([ a-zA-Z0-9_]+))?$/,
    run: async (
        bridge,
        bot,
        type: "Guild >" | "Officer >" | "From",
        rank: string | undefined,
        author: string,
        guildRank: string | undefined,
        bridgeAuthor: string | undefined,
        query?: string
    ) => {
        if (bridgeAuthor && bridgeAuthor.startsWith(bridge.BRIDGE_CHAR)) return;
        
        const channel =
            type === "Officer >" ? "/oc" :
            type === "From" ? `/msg ${author}` :
            "/gc"
        ;

        // will be result of await getSkills
        let skillRes: Awaited<ReturnType<typeof getSkills>>;
        let skill: string | undefined;
        if (query) {
            const params = query.split(" ");
            skill = params.length > 1 ? params.slice(1).join(" ") : query;
            skillRes = await getSkills(params[0]);
            if (params.length === 1 && !skillRes.success) {
                skillRes = await getSkills(bridgeAuthor || author);
                skill = query;
            }
        } else {
            skillRes = await getSkills(bridgeAuthor || author);
        }

        if (!skillRes.success) {
            return bot.chat(`${channel} ${skillRes.message}`, bridge, "Failed to send skills error message", bot.name);
        }

        if (skill && skillRes.skills[skill as keyof typeof skillRes.skills]) {
            const s = skillRes.skills[skill as keyof typeof skillRes.skills];
            return bot.chat(`${channel} ${skillRes.username}'s ${skill} skill: ${formatNumber(s.overflowLevel ? s.overflowLevel : s.level)}${s.overflowXp ? ` (+${formatNumber(s.overflowXp)})` : ""}`, bridge, "Failed to send skill message", bot.name);
        }
        bot.chat(`${channel} ${skillRes.username}'s skills: ${[
            `Combat ${formatNumber(skillRes.skills.combat?.overflowLevel ? skillRes.skills.combat.overflowLevel : skillRes.skills.combat.level)}${skillRes.skills.combat?.overflowXp ? ` (+${formatNumber(skillRes.skills.combat.overflowXp)})` : ""}`,
            `Mining ${formatNumber(skillRes.skills.mining?.overflowLevel ? skillRes.skills.mining.overflowLevel : skillRes.skills.mining.level)}${skillRes.skills.mining?.overflowXp ? ` (+${formatNumber(skillRes.skills.mining.overflowXp)})` : ""}`,
            `Farming ${formatNumber(skillRes.skills.farming?.overflowLevel ? skillRes.skills.farming.overflowLevel : skillRes.skills.farming.level)}${skillRes.skills.farming?.overflowXp ? ` (+${formatNumber(skillRes.skills.farming.overflowXp)})` : ""}`,
            `Foraging ${formatNumber(skillRes.skills.foraging?.overflowLevel ? skillRes.skills.foraging.overflowLevel : skillRes.skills.foraging.level)}${skillRes.skills.foraging?.overflowXp ? ` (+${formatNumber(skillRes.skills.foraging.overflowXp)})` : ""}`,
            `Fishing ${formatNumber(skillRes.skills.fishing?.overflowLevel ? skillRes.skills.fishing.overflowLevel : skillRes.skills.fishing.level)}${skillRes.skills.fishing?.overflowXp ? ` (+${formatNumber(skillRes.skills.fishing.overflowXp)})` : ""}`,
            `Hunting ${formatNumber(skillRes.skills.hunting?.overflowLevel ? skillRes.skills.hunting.overflowLevel : skillRes.skills.hunting.level)}${skillRes.skills.hunting?.overflowXp ? ` (+${formatNumber(skillRes.skills.hunting.overflowXp)})` : ""}`,
            `Enchanting ${formatNumber(skillRes.skills.enchanting?.overflowLevel ? skillRes.skills.enchanting.overflowLevel : skillRes.skills.enchanting.level)}${skillRes.skills.enchanting?.overflowXp ? ` (+${formatNumber(skillRes.skills.enchanting.overflowXp)})` : ""}`,
            `Skill Avg ${formatNumber( (
                ( skillRes.skills.combat?.overflowLevel ? skillRes.skills.combat.overflowLevel : skillRes.skills.combat.level ) +
                ( skillRes.skills.farming?.overflowLevel ? skillRes.skills.farming.overflowLevel : skillRes.skills.farming.level ) +
                ( skillRes.skills.fishing?.overflowLevel ? skillRes.skills.fishing.overflowLevel : skillRes.skills.fishing.level ) +
                ( skillRes.skills.mining?.overflowLevel ? skillRes.skills.mining.overflowLevel : skillRes.skills.mining.level ) +
                ( skillRes.skills.foraging?.overflowLevel ? skillRes.skills.foraging.overflowLevel : skillRes.skills.foraging.level ) +
                ( skillRes.skills.enchanting?.overflowLevel ? skillRes.skills.enchanting.overflowLevel : skillRes.skills.enchanting.level ) +
                ( skillRes.skills.alchemy?.overflowLevel ? skillRes.skills.alchemy.overflowLevel : skillRes.skills.alchemy.level ) +
                ( skillRes.skills.carpentry?.overflowLevel ? skillRes.skills.carpentry.overflowLevel : skillRes.skills.carpentry.level ) +
                ( skillRes.skills.taming?.overflowLevel ? skillRes.skills.taming.overflowLevel : skillRes.skills.taming.level ) +
                ( skillRes.skills.hunting?.overflowLevel ? skillRes.skills.hunting.overflowLevel : skillRes.skills.hunting.level )
            ) / 10)}`
        ].join(" - ")}`, bridge, "Failed to send skills message", bot.name);
    }
} as BotEvent;