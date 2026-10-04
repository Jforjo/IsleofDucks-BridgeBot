type EmojisResponse = {
    success: false;
    message: string;
} | {
    success: true;
    emojis: {
        replacetext: string;
        withtext: string;
    }[];
};

export default async function getEmojis(): Promise<EmojisResponse> {
    const res = await fetch(`https://isle-of-ducks.vercel.app/api/emojis`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.VERCEL_API_KEY}`
        }
    });

    if (!res.ok) return { success: false, message: "Unable to fetch emojis" };
    const data = await res.json() as EmojisResponse;
    return data;
}