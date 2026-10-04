import getUsernameOrUUID from "./uuid.ts";

type CollectionResponseWithUUID = {
    success: false;
    message: string;
} | {
    success: true;
    collections: {
        id: string;
        amount: number;
        name: string | null;
    }[];
}
type CollectionResponseWithoutUUID = {
    success: false;
    message: string;
} | {
    success: true;
    uuid: false;
    collections: string[];
}

export default async function getCollections(query: string): Promise<{
    success: false;
    message: string;
} | {
    success: true;
    collections: {
        id: string;
        amount: number;
        name: string | null;
    }[];
    username: string;
}> {
    const user = await getUsernameOrUUID(query);
    if (!user.success) return user;
    
    const res = await fetch(`https://isle-of-ducks.vercel.app/api/collections?uuid=${user.uuid}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.VERCEL_API_KEY}`
        }
    });

    if (!res.ok) return { success: false, message: "Unable to fetch collection data" };
    const data = await res.json() as CollectionResponseWithUUID;
    if (data.success) return {
        success: data.success,
        collections: data.collections,
        username: user.name
    };
    return data
}

export async function getAllCollections(): Promise<{
    success: true;
    collections: string[];
} | {
    success: false;
    message: string;
}> {
    const res = await fetch(`https://isle-of-ducks.vercel.app/api/collections`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.VERCEL_API_KEY}`
        }
    });

    if (!res.ok) return { success: false, message: "Unable to fetch collection data" };
    const data = await res.json() as CollectionResponseWithoutUUID;
    if (data.success) return {
        success: data.success,
        collections: data.collections
    }
    return {
        success: data.success,
        message: data.message
    }
}

export async function isValidCollection(query: string): Promise<{
    success: false;
    message: string;
} | {
    success: true;
    isValid: boolean;
}> {
    const collectionResult = await getAllCollections();
    if (!collectionResult.success) return collectionResult;
    return { success: true, isValid: collectionResult.collections.map(c => c.toLowerCase()).includes(query.toLowerCase()) };
}