import getUsernameOrUUID from "./uuid.ts";
import getProfiles from "./profile.ts";

export default async function getKuudraData(
    query: string
): Promise<
    {
        success: true;
        username: string;
        comps: {
            basic: number;
            hot: number;
            burning: number;
            fiery: number;
            infernal: number;
        };
        coll: number;
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

    return {
        success: true,
        username: user.name,
        comps: {
            basic: profile.members[uuid]?.nether_island_player_data?.kuudra_completed_tiers?.none ?? 0,
            hot: profile.members[uuid]?.nether_island_player_data?.kuudra_completed_tiers?.hot ?? 0,
            burning: profile.members[uuid]?.nether_island_player_data?.kuudra_completed_tiers?.burning ?? 0,
            fiery: profile.members[uuid]?.nether_island_player_data?.kuudra_completed_tiers?.fiery ?? 0,
            infernal: profile.members[uuid]?.nether_island_player_data?.kuudra_completed_tiers?.infernal ?? 0
        },
        coll: 
            (profile.members[uuid]?.nether_island_player_data?.kuudra_completed_tiers?.none ?? 0) * 1 +
            (profile.members[uuid]?.nether_island_player_data?.kuudra_completed_tiers?.hot ?? 0) * 2 +
            (profile.members[uuid]?.nether_island_player_data?.kuudra_completed_tiers?.burning ?? 0) * 3 +
            (profile.members[uuid]?.nether_island_player_data?.kuudra_completed_tiers?.fiery ?? 0) * 4 +
            (profile.members[uuid]?.nether_island_player_data?.kuudra_completed_tiers?.infernal ?? 0) * 5
    };
}