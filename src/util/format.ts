export function formatNumber(num: number | null, decimals: number | undefined = 2): string {
    if (num == null) return "0";
    if (num >= 1_000_000_000_000) return parseFloat((num / 1_000_000_000_000).toFixed(decimals)) + 'T';
    if (num >= 1_000_000_000) return parseFloat((num / 1_000_000_000).toFixed(decimals)) + 'B';
    if (num >= 1_000_000) return parseFloat((num / 1_000_000).toFixed(decimals)) + 'M';
    if (num >= 1_000) return parseFloat((num / 1_000).toFixed(decimals)) + 'K';
    // if whole number then return as is
    if (num % 1 === 0) return num.toString();
    return num.toFixed(decimals);
}
export function formatNumberWithCommas(num: number, decimals: number | undefined = 2): string {
    const addCommas = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (num % 1 === 0) return addCommas(num);
    const numAndDecimals = num.toFixed(decimals).split(".");
    return addCommas(parseInt(numAndDecimals[0])) + "." + numAndDecimals[1];
}
export function capataliseFirstLetter(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function messageFilter(message: string, filters: Record<string, string>): string {
    return message.split(" ").map(word => {
        if (Object.keys(filters).includes(word.toLowerCase().replaceAll(/[^a-z0-9:]/gi, "")))
            return filters[word.toLowerCase().replaceAll(/[^a-z0-9:]/gi, "")];
        return word;
    }).join(" ");
}