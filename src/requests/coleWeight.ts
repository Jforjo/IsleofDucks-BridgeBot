export default async function getColeWeight(
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
    }
> {
    try {
        const res = await fetch(`https://ninjune.dev/api/coleweight?username=${encodeURIComponent(query)}`, {
            method: 'GET'
        });
        if (!res.ok) return {
            success: false,
            message: "Unable to fetch Cole Weight"
        }
        
        const data = await res.json();
        if (data.code) return {
            success: false,
            message: `Cole Weight error: "${data.error}"`
        }
        return {
            success: true,
            username: data.name,
            weight: data.coleweight,
            rank: data.rank
        }
    } catch (e) {
        return {
            success: false,
            message: `Cole Weight trycatch error: "${e}"`
        }
    }
}