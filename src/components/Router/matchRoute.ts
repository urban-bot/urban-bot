type PatchOptions = { regex?: boolean; path?: string };

export const matchRoute = (pathname: string, options: PatchOptions) => {
    const { regex = false, path } = options;

    if (!path) {
        return true;
    }

    if (regex) {
        return new RegExp(`^${path}`).exec(pathname);
    }

    return path === pathname;
};
