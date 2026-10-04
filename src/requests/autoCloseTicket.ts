export default async function getCollections(username: string): Promise<{
    success: false;
    message: string;
} | {
    success: true;
}> {
    const res = await fetch(`https://isle-of-ducks.vercel.app/api/autocloseticket?name=${username}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.VERCEL_API_KEY}`
        }
    });

    if (!res.ok) return { success: false, message: "Unable to fetch result from auto closing ticket" };
    const data = await res.json() as {
        success: false;
        message: string;
    } | {
        success: true;
    };
    return data;
}