// import type { ResourcesSkyblockItemsResponse } from "@zikeji/hypixel/dist/types/AugmentedTypes";

export default async function getItems(): Promise<
    {
        success: true;
        // items: ResourcesSkyblockItemsResponse["items"]
        items: string[]
    } | {
        success: false;
        message: string;
    }
> {
    // const res = await fetch(`https://api.hypixel.net/v2/resources/skyblock/items`, {
    const res = await fetch(`https://isle-of-ducks.vercel.app/api/items`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.VERCEL_API_KEY}`
        }
    });
    if (!res.ok) return {
        success: false,
        message: "Failed to fetch SkyBlock items"
    }
    const data = await res.json();
    if (!data.success) return {
        success: false,
        message: data.message
    }
    return {
        success: true,
        items: data.items
    }
}