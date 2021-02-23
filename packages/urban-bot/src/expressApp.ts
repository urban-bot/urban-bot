import express from 'express';

export type ExpressAppType = {
    app: express.Express;
    isStarted: boolean;
};

const expressAppMap = new Map<number, ExpressAppType>();

export function getExpressApp(port: number, expressApp = express()) {
    if (!expressAppMap.has(port)) {
        expressAppMap.set(port, { app: expressApp, isStarted: false });
    }

    return expressAppMap.get(port) as ExpressAppType;
}

export function listen(port: number) {
    const app = getExpressApp(port);
    if (!app.isStarted) {
        app.app.listen(port);
        app.isStarted = true;
    }
}
