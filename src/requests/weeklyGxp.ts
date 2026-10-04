import getGuild from "./guild.ts";
import getUsernameOrUUID from "./uuid.ts";

export default async function getWeeklyGxp(
    query: string
): Promise<
    {
        success: true;
        username: string;
        gxp: number;
        rank: number;
        guildName: string;
        memberJoinedGuild: Date;
    } | {
        success: false;
        message: string;
        retryAfter?: number;
    }
> {
    const user = await getUsernameOrUUID(query);
    if (!user.success) return user;
    const guild = await getGuild(user.uuid);
    if (!guild.success) return guild;
    const gxps = Object.fromEntries(guild.guild.members.map(member => {
        return [
            member.uuid,
            Object.values(member.expHistory).reduce((a, b) => ( a ?? 0 ) + ( b ?? 0 ), 0) ?? 0
        ]
    }));
    const member = gxps[user.uuid];
    const m = guild.guild.members.find(member => member.uuid === user.uuid);
    if (!member || !m) return {
        success: false,
        message: "User is not in a guild"
    };
    return {
        success: true,
        username: user.name,
        gxp: member,
        rank: Object.entries(gxps).sort((a, b) => b[1] - a[1]).findIndex(([uuid, _]) => uuid === user.uuid) + 1,
        guildName: guild.guild.name,
        memberJoinedGuild: new Date(m.joined)
    };
}