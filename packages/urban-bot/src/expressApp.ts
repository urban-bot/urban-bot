import express from 'express';

const expressAppMap = new Map<number, { app: express.Express; isStarted: boolean }>();

export function getExpressApp(port: number) {
    const expressApp = expressAppMap.get(port);

    if (expressApp !== undefined) {
        return expressApp;
    }

    const newExpressApp = { app: express(), isStarted: false };

    expressAppMap.set(port, newExpressApp);

    return newExpressApp;
}

export function listen(port: number) {
    const app = getExpressApp(port);
    if (!app.isStarted) {
        app.app.listen(port);
        app.isStarted = true;
    }
}
