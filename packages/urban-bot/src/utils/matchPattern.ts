export type Pattern = string | RegExp;

export function matchPattern(text: string, pattern: Pattern | Pattern[]) {
    const patterns = Array.isArray(pattern) ? pattern : [pattern];

    return patterns.some((pattern) => {
        if (pattern instanceof RegExp) {
            return pattern.test(text);
        }

        return pattern === text;
    });
}
