export const generateFirstMessage = ({ userName, userId }: { userName: string; userId: string }): string => {
    return `[{"type":"paragraph","children":[{"text":"This discussion was created by "},{"type":"mention","displayName":"${userName} ","userId":"${userId}","children":[{"text":""}]},{"text":""}]}]`
}