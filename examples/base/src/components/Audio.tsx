// import fs from 'fs';
// import path from 'path';
import React from 'react';
import { Audio } from '@urban-bot/core';

// const audioByFile = fs.readFileSync(path.join(__dirname, 'audio.mp3'));

export function AudioExample() {
    return <Audio file={'urlToFile' /* || audioByFile */} title="There is the song" name="Some name" />;
}
