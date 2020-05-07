import fs from 'fs';
import path from 'path';
import React, { useMemo } from 'react';
import { Animation } from 'urban-bot';

function readFile(fileName: string) {
    try {
        return fs.readFileSync(path.join(__dirname, fileName));
    } catch (error) {
        return undefined;
    }
}

export function AnimationExample() {
    const animationByFile = useMemo(() => readFile('roboHare.gif'), []);

    if (!animationByFile) {
        return null;
    }

    return <Animation file={animationByFile} title="There is the animation" name="File Name" />;
}
