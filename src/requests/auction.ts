// import type { ResourcesSkyblockItemsResponse } from "@zikeji/hypixel/dist/types/AugmentedTypes";

export default async function getBinAuction(item: string): Promise<
    {
        success: true;
        // items: ResourcesSkyblockItemsResponse["items"]
        auction: {
            name: string;
            amount: number;
        }
    } | {
        success: false;
        message: string;
    }
> {
    const res = await fetch(`https://isle-of-ducks.vercel.app/api/auctions?item=${encodeURIComponent(item)}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.VERCEL_API_KEY}`
        }
    });
    if (!res.ok) return {
        success: false,
        message: "Failed to fetch SkyBlock auction data"
    }
    const data = await res.json();
    if (!data.success) return {
        success: false,
        message: data.message
    }
    return data as {
        success: true;
        auction: {
            name: string;
            amount: number;
        }
    };
}