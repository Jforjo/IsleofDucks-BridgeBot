// import type { ResourcesSkyblockItemsResponse } from "@zikeji/hypixel/dist/types/AugmentedTypes";

export default async function getBazaar(item: string): Promise<
    {
        success: true;
        // items: ResourcesSkyblockItemsResponse["items"]
        bazaar: {
            name: string;
            sell: number;
            buy: number;
        }
    } | {
        success: false;
        message: string;
    }
> {
    const res = await fetch(`https://isle-of-ducks.vercel.app/api/bazaar?item=${encodeURIComponent(item)}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.VERCEL_API_KEY}`
        }
    });
    if (!res.ok) return {
        success: false,
        message: "Failed to fetch SkyBlock bazaar data"
    }
    const data = await res.json();
    if (!data.success) return {
        success: false,
        message: data.message
    }
    return data as {
        success: true;
        bazaar: {
            name: string;
            sell: number;
            buy: number;
        }
    };
}