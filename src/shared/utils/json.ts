export function parseJson(jsonStr: string) {
    try {
        return JSON.parse(jsonStr);
    } catch (err) {
        return {};
    }
}