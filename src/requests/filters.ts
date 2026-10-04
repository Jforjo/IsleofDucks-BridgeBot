type ChatFiltersResponse = {
    success: false;
    message: string;
} | {
    success: true;
    filters: {
        replacetext: string;
        withtext: string;
    }[];
};

export default async function getChatFilters(): Promise<ChatFiltersResponse> {
    const res = await fetch(`https://isle-of-ducks.vercel.app/api/filters`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.VERCEL_API_KEY}`
        }
    });

    if (!res.ok) return { success: false, message: "Unable to fetch chat filters" };
    const data = await res.json() as ChatFiltersResponse;
    return data;
}