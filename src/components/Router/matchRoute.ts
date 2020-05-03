type PatchOptions = { pattern?: string | RegExp };

export const matchRoute = (pathname: string, options: PatchOptions) => {
    const { pattern } = options;

    if (!pattern) {
        return true;
    }

    if (pattern instanceof RegExp) {
        return pattern.exec(pathname);
    }

    return pattern === pathname;
};
