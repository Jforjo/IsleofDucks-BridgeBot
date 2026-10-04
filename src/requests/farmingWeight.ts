import { createFarmingWeightCalculator } from 'farming-weight';
import getUsernameOrUUID from "./uuid.ts";
import getProfiles from './profile.ts';

export async function getFarmingWeightRank(
    uuid: string,
    profileId: string
): Promise<
    {
        success: true;
        rank: number;
    } | {
        success: false;
        message: string;
    }
> {
    try {
        const res = await fetch(`https://api.elitebot.dev/leaderboard/rank/farmingweight/${encodeURIComponent(uuid)}/${encodeURIComponent(profileId)}`, {
            method: 'GET'
        });
        if (!res.ok) return {
            success: false,
            message: "Unable to fetch Farming Weight"
        }

        const data = await res.json();
        if (data.errors) return {
            success: false,
            message: data.message
        }
        return {
            success: true,
            rank: data.rank
        }
    } catch (e) {return {
            success: false,
            message: `Farming Weight trycatch error: "${e}"`
        }
    }
}

export default async function getFarmingWeight(
    query: string
): Promise<
    {
        success: true;
        username: string;
        weight: number;
        rank: number;
    } | {
        success: false;
        message: string;
        retryAfter?: number;
    }
> {
    const user = await getUsernameOrUUID(query);
    if (!user.success) return user;
    const uuid = user.uuid;

    const profiles = await getProfiles(uuid);
    if (!profiles.success) return profiles;
    const profile = profiles.profiles.find(p => p.selected);
    if (!profile || !profile.profile_id) {
        return {
            success: false,
            message: 'No selected profile found'
        };
    }
    const member = profile.members[uuid];

    const calculator = createFarmingWeightCalculator({
        collection: member.collection,
        farmingXp: member.player_data?.experience?.SKILL_FARMING,
        levelCapUpgrade: member.jacobs_contest?.perks?.farming_level_cap,
        anitaBonusFarmingFortuneLevel: member.jacobs_contest?.perks?.double_drops,
        minions: Object.values(profile.members).flatMap(member => member.player_data?.crafted_generators ?? []).filter(x => x !== undefined && x !== null),
        contests: Object.values(member.jacobs_contest?.contests ?? {}),
        pests: member.bestiary?.kills
    });
    const weight = calculator.getWeightInfo();

    const rankRes = await getFarmingWeightRank(uuid, profile.profile_id);
    if (!rankRes.success) return rankRes;

    return {
        success: true,
        username: user.name,
        weight: weight.totalWeight,
        rank: rankRes.rank
    }
}