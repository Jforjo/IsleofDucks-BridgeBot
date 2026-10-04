import type { ResourcesSkyblockSkillsResponse } from "@zikeji/hypixel/dist/types/AugmentedTypes";
import getProfiles from "./profile.ts";
import getUsernameOrUUID from "./uuid.ts";
import type { SkyBlockProfileMemberPlayerData } from "@zikeji/hypixel/dist/types/Augmented/SkyBlock/ProfileMember";

/* Command to get from wiki
document.querySelectorAll('.wikitable')[0].querySelector('tbody').querySelectorAll('tr').forEach((row, index) => {
    row.querySelectorAll('td').forEach((td, index) => {
        if (index === 2 || index === 0) return;
        td.style.display = "none";
    })
})
*/

export const skillLevels: Record<string, Record<number, number>> = {
    combat: {
        1: 50,
        2: 175,
        3: 375,
        4: 675,
        5: 1175,
        6: 1925,
        7: 2925,
        8: 4425,
        9: 6425,
        10: 9925,
        11: 14925,
        12: 22425,
        13: 32425,
        14: 47425,
        15: 67425,
        16: 97425,
        17: 147425,
        18: 222425,
        19: 322425,
        20: 522425,
        21: 822425,
        22: 1222425,
        23: 1722425,
        24: 2322425,
        25: 3022425,
        26: 3822425,
        27: 4722425,
        28: 5722425,
        29: 6822425,
        30: 8022425,
        31: 9322425,
        32: 10722425,
        33: 12222425,
        34: 13822425,
        35: 15522425,
        36: 17322425,
        37: 19222425,
        38: 21222425,
        39: 23322425,
        40: 25522425,
        41: 27822425,
        42: 30222425,
        43: 32722425,
        44: 35322425,
        45: 38072425,
        46: 40972425,
        47: 44072425,
        48: 47472425,
        49: 51172425,
        50: 55172425,
        51: 59472425,
        52: 64072425,
        53: 68972425,
        54: 74172425,
        55: 79672425,
        56: 85472425,
        57: 91572425,
        58: 97972425,
        59: 104672425,
        60: 111672425
    },
    mining: {
        1: 50,
        2: 175,
        3: 375,
        4: 675,
        5: 1175,
        6: 1925,
        7: 2925,
        8: 4425,
        9: 6425,
        10: 9925,
        11: 14925,
        12: 22425,
        13: 32425,
        14: 47425,
        15: 67425,
        16: 97425,
        17: 147425,
        18: 222425,
        19: 322425,
        20: 522425,
        21: 822425,
        22: 1222425,
        23: 1722425,
        24: 2322425,
        25: 3022425,
        26: 3822425,
        27: 4722425,
        28: 5722425,
        29: 6822425,
        30: 8022425,
        31: 9322425,
        32: 10722425,
        33: 12222425,
        34: 13822425,
        35: 15522425,
        36: 17322425,
        37: 19222425,
        38: 21222425,
        39: 23322425,
        40: 25522425,
        41: 27822425,
        42: 30222425,
        43: 32722425,
        44: 35322425,
        45: 38072425,
        46: 40972425,
        47: 44072425,
        48: 47472425,
        49: 51172425,
        50: 55172425,
        51: 59472425,
        52: 64072425,
        53: 68972425,
        54: 74172425,
        55: 79672425,
        56: 85472425,
        57: 91572425,
        58: 97972425,
        59: 104672425,
        60: 111672425
    },
    farming: {
        1: 50,
        2: 175,
        3: 375,
        4: 675,
        5: 1175,
        6: 1925,
        7: 2925,
        8: 4425,
        9: 6425,
        10: 9925,
        11: 14925,
        12: 22425,
        13: 32425,
        14: 47425,
        15: 67425,
        16: 97425,
        17: 147425,
        18: 222425,
        19: 322425,
        20: 522425,
        21: 822425,
        22: 1222425,
        23: 1722425,
        24: 2322425,
        25: 3022425,
        26: 3822425,
        27: 4722425,
        28: 5722425,
        29: 6822425,
        30: 8022425,
        31: 9322425,
        32: 10722425,
        33: 12222425,
        34: 13822425,
        35: 15522425,
        36: 17322425,
        37: 19222425,
        38: 21222425,
        39: 23322425,
        40: 25522425,
        41: 27822425,
        42: 30222425,
        43: 32722425,
        44: 35322425,
        45: 38072425,
        46: 40972425,
        47: 44072425,
        48: 47472425,
        49: 51172425,
        50: 55172425,
        51: 59472425,
        52: 64072425,
        53: 68972425,
        54: 74172425,
        55: 79672425,
        56: 85472425,
        57: 91572425,
        58: 97972425,
        59: 104672425,
        60: 111672425
    },
    foraging: {
        1: 50,
        2: 175,
        3: 375,
        4: 675,
        5: 1175,
        6: 1925,
        7: 2925,
        8: 4425,
        9: 6425,
        10: 9925,
        11: 14925,
        12: 22425,
        13: 32425,
        14: 47425,
        15: 67425,
        16: 97425,
        17: 147425,
        18: 222425,
        19: 322425,
        20: 522425,
        21: 822425,
        22: 1222425,
        23: 1722425,
        24: 2322425,
        25: 3022425,
        26: 3822425,
        27: 4722425,
        28: 5722425,
        29: 6822425,
        30: 8022425,
        31: 9322425,
        32: 10722425,
        33: 12222425,
        34: 13822425,
        35: 15522425,
        36: 17322425,
        37: 19222425,
        38: 21222425,
        39: 23322425,
        40: 25522425,
        41: 27822425,
        42: 30222425,
        43: 32722425,
        44: 35322425,
        45: 38072425,
        46: 40972425,
        47: 44072425,
        48: 47472425,
        49: 51172425,
        50: 55172425,
        51: 59472425,
        52: 64072425,
        53: 68972425,
        54: 74172425
    },
    fishing: {
        1: 50,
        2: 175,
        3: 375,
        4: 675,
        5: 1175,
        6: 1925,
        7: 2925,
        8: 4425,
        9: 6425,
        10: 9925,
        11: 14925,
        12: 22425,
        13: 32425,
        14: 47425,
        15: 67425,
        16: 97425,
        17: 147425,
        18: 222425,
        19: 322425,
        20: 522425,
        21: 822425,
        22: 1222425,
        23: 1722425,
        24: 2322425,
        25: 3022425,
        26: 3822425,
        27: 4722425,
        28: 5722425,
        29: 6822425,
        30: 8022425,
        31: 9322425,
        32: 10722425,
        33: 12222425,
        34: 13822425,
        35: 15522425,
        36: 17322425,
        37: 19222425,
        38: 21222425,
        39: 23322425,
        40: 25522425,
        41: 27822425,
        42: 30222425,
        43: 32722425,
        44: 35322425,
        45: 38072425,
        46: 40972425,
        47: 44072425,
        48: 47472425,
        49: 51172425,
        50: 55172425
    },
    enchanting: {
        1: 50,
        2: 175,
        3: 375,
        4: 675,
        5: 1175,
        6: 1925,
        7: 2925,
        8: 4425,
        9: 6425,
        10: 9925,
        11: 14925,
        12: 22425,
        13: 32425,
        14: 47425,
        15: 67425,
        16: 97425,
        17: 147425,
        18: 222425,
        19: 322425,
        20: 522425,
        21: 822425,
        22: 1222425,
        23: 1722425,
        24: 2322425,
        25: 3022425,
        26: 3822425,
        27: 4722425,
        28: 5722425,
        29: 6822425,
        30: 8022425,
        31: 9322425,
        32: 10722425,
        33: 12222425,
        34: 13822425,
        35: 15522425,
        36: 17322425,
        37: 19222425,
        38: 21222425,
        39: 23322425,
        40: 25522425,
        41: 27822425,
        42: 30222425,
        43: 32722425,
        44: 35322425,
        45: 38072425,
        46: 40972425,
        47: 44072425,
        48: 47472425,
        49: 51172425,
        50: 55172425,
        51: 59472425,
        52: 64072425,
        53: 68972425,
        54: 74172425,
        55: 79672425,
        56: 85472425,
        57: 91572425,
        58: 97972425,
        59: 104672425,
        60: 111672425
    }
}

export async function getSkillData(): Promise<
    {
        success: true;
        skills: ResourcesSkyblockSkillsResponse["skills"];
    } | {
        success: false;
        message: string;
    }
> {
    const res = await fetch(`https://api.hypixel.net/v2/resources/skyblock/skills`, {
        method: 'GET'
    });
    if (res.status === 200) {
        const data = await res.json() as ResourcesSkyblockSkillsResponse;
        if (data.success) {
            if (!data.skills) {
                return {
                    success: false,
                    message: 'Skills not found'
                };
            }
            return {
                success: true,
                skills: data.skills
            };
        } else {
            return {
                success: false,
                message: "Unknown error"
            };
        }
    } else {
        return {
            success: false,
            message: "Unknown error"
        };
    }
}

export async function getSkillLevels(): Promise<Record<string, Record<number, number>>> {
    const skillData = await getSkillData();
    // manual fallback data
    if (!skillData.success) return skillLevels;

    const skills = skillData.skills;
    return Object.fromEntries(
        Object.values(skills).map(skill => [
            skill.name.toLowerCase(),
            Object.fromEntries(
                skill.levels.map(levelData => [
                    levelData.level,
                    levelData.totalExpRequired
                ])
            )
        ])
    );
}

export async function getPlayerSkillLevels(
    playerSkillData: SkyBlockProfileMemberPlayerData["experience"]
): Promise<
    Record<keyof ResourcesSkyblockSkillsResponse["skills"], {
        level: number;
        xp: number;
        overflowXP?: number;
        overflowLevel?: number;
    }> | undefined
> {
    if (!playerSkillData) return;

    const skillData = await getSkillLevels();

    return Object.fromEntries(
        Object.entries(playerSkillData).map(([skillKey, xp]) => {
            if (!xp) return;
            const skillType = skillKey.replace("SKILL_", "").toLowerCase() as keyof ResourcesSkyblockSkillsResponse["skills"];
            if (!skillData[skillType]) return;
            const level = calcSkillLevel(skillType, xp, skillData);
            const highestXp = Object.values(skillData[skillType]).reduce((max, curr) => Math.max(max, curr), 0);
            const overflowXP = xp - highestXp;
            return [
                skillType,
                {
                    level: level.level,
                    xp: xp,
                    overflowXP: overflowXP > 0 ? overflowXP : undefined,
                    overflowLevel: level?.overflowLevel
                }
            ];
        }).filter(Boolean) as [keyof ResourcesSkyblockSkillsResponse["skills"], {
            level: number;
            xp: number;
            overflowXP?: number;
        }][]
    );
}

export function getSkillXp(
    type: keyof ResourcesSkyblockSkillsResponse["skills"],
    level: number,
    skillData: Record<string, Record<number, number>>
): number {
    if (level < 1) return 0;
    if (typeof type !== "string") return -1;
    if (!skillData[type]) return -1;
    if (skillData[type][level] !== undefined) return skillData[type][level];

    return -2;
}

export function calcSkillLevel(
    skillType: keyof ResourcesSkyblockSkillsResponse["skills"],
    skillXp: number,
    skillData: Record<string, Record<number, number>>
): {
    level: number;
    overflowLevel?: number;
} {
    let level = 0;
    while (true) {
        const nextXp = getSkillXp(skillType, level + 1, skillData);
        if (nextXp === -1) return { level };
        if (nextXp === -2) break;
        if (skillXp < nextXp) {
            const prevXp = getSkillXp(skillType, level, skillData);
            return {
                level: level + (skillXp - prevXp) / (nextXp - prevXp)
            };
            // return level;
        }
        level++;
    }
    // Overflow Level
    let overflowLevel = 0;
    const maxXp = getSkillXp(skillType, level, skillData);
    const prevMaxXpRaw = getSkillXp(skillType, level - 1, skillData);
    const prevMaxXp = prevMaxXpRaw < 0 ? 0 : prevMaxXpRaw;
    const lastLevelXp = maxXp - prevMaxXp;
    let slope = (
        ( maxXp - prevMaxXpRaw ) -
        ( prevMaxXpRaw - getSkillXp(skillType, level - 2, skillData) )
    ) * 2;
    let xpForCurr = lastLevelXp + slope;
    let overflowXp = skillXp - maxXp;
    while (overflowXp >= xpForCurr) {
        overflowLevel++;
        overflowXp -= xpForCurr;
        xpForCurr += slope;
        if ((level + overflowLevel) % 10 === 0) slope *= 2;
    }

    return {
        level: level,
        overflowLevel: (level + overflowLevel) + (overflowXp / xpForCurr)
    };
}

export default async function getSkills(
    query: string
): Promise<
    {
        success: true;
        username: string;
        skills: {
            combat: {
                xp: number;
                level: number;
                overflowXp?: number;
                overflowLevel?: number;
            };
            mining: {
                xp: number;
                level: number;
                overflowXp?: number;
                overflowLevel?: number;
            };
            farming: {
                xp: number;
                level: number;
                overflowXp?: number;
                overflowLevel?: number;
            };
            foraging: {
                xp: number;
                level: number;
                overflowXp?: number;
                overflowLevel?: number;
            };
            fishing: {
                xp: number;
                level: number;
                overflowXp?: number;
                overflowLevel?: number;
            };
            hunting: {
                xp: number;
                level: number;
                overflowXp?: number;
                overflowLevel?: number;
            };
            enchanting: {
                xp: number;
                level: number;
                overflowXp?: number;
                overflowLevel?: number;
            };
            alchemy: {
                xp: number;
                level: number;
                overflowXp?: number;
                overflowLevel?: number;
            };
            carpentry: {
                xp: number;
                level: number;
                overflowXp?: number;
                overflowLevel?: number;
            };
            taming: {
                xp: number;
                level: number;
                overflowXp?: number;
                overflowLevel?: number;
            };
        };
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
    const profileData = profile.members[uuid];

    const playerSkillData = await getPlayerSkillLevels(profileData?.player_data?.experience);

    return {
        success: true,
        username: user.name,
        skills: {
            combat: {
                xp: profileData?.player_data?.experience?.SKILL_COMBAT || 0,
                level: playerSkillData?.combat?.level || 0,
                overflowXp: playerSkillData?.combat?.overflowXP,
                overflowLevel: playerSkillData?.combat?.overflowLevel
            },
            mining: {
                xp: profileData?.player_data?.experience?.SKILL_MINING || 0,
                level: playerSkillData?.mining?.level || 0,
                overflowXp: playerSkillData?.mining?.overflowXP,
                overflowLevel: playerSkillData?.mining?.overflowLevel
            },
            farming: {
                xp: profileData?.player_data?.experience?.SKILL_FARMING || 0,
                level: playerSkillData?.farming?.level || 0,
                overflowXp: playerSkillData?.farming?.overflowXP,
                overflowLevel: playerSkillData?.farming?.overflowLevel
            },
            foraging: {
                xp: profileData?.player_data?.experience?.SKILL_FORAGING || 0,
                level: playerSkillData?.foraging?.level || 0,
                overflowXp: playerSkillData?.foraging?.overflowXP,
                overflowLevel: playerSkillData?.foraging?.overflowLevel
            },
            fishing: {
                xp: profileData?.player_data?.experience?.SKILL_FISHING || 0,
                level: playerSkillData?.fishing?.level || 0,
                overflowXp: playerSkillData?.fishing?.overflowXP,
                overflowLevel: playerSkillData?.fishing?.overflowLevel
            },
            hunting: {
                xp: profileData?.player_data?.experience?.SKILL_HUNTING || 0,
                level: playerSkillData?.hunting?.level || 0,
                overflowXp: playerSkillData?.hunting?.overflowXP,
                overflowLevel: playerSkillData?.hunting?.overflowLevel
            },
            enchanting: {
                xp: profileData?.player_data?.experience?.SKILL_ENCHANTING || 0,
                level: playerSkillData?.enchanting?.level || 0,
                overflowXp: playerSkillData?.enchanting?.overflowXP,
                overflowLevel: playerSkillData?.enchanting?.overflowLevel
            },
            alchemy: {
                xp: profileData?.player_data?.experience?.SKILL_ALCHEMY || 0,
                level: playerSkillData?.alchemy?.level || 0,
                overflowXp: playerSkillData?.alchemy?.overflowXP,
                overflowLevel: playerSkillData?.alchemy?.overflowLevel
            },
            carpentry: {
                xp: profileData?.player_data?.experience?.SKILL_CARPENTRY || 0,
                level: playerSkillData?.carpentry?.level || 0,
                overflowXp: playerSkillData?.carpentry?.overflowXP,
                overflowLevel: playerSkillData?.carpentry?.overflowLevel
            },
            taming: {
                xp: profileData?.player_data?.experience?.SKILL_TAMING || 0,
                level: playerSkillData?.taming?.level || 0,
                overflowXp: playerSkillData?.taming?.overflowXP,
                overflowLevel: playerSkillData?.taming?.overflowLevel
            }
        }
    }
}