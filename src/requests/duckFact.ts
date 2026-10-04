// This no longer exists...
export default async function getDuckFact(): Promise<string> {
    const res = await fetch(`https://random-d.uk/api/fact`, {
        method: 'GET'
    });
    const data = await res.json() as { fact: string };
    return data.fact;
}