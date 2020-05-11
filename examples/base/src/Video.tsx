// import fs from 'fs';
// import path from 'path';
import React from 'react';
import { Video } from '@urban-bot/core';

// const videoByFile = fs.readFileSync(path.join(__dirname, 'video.mp4'));

export function VideoExample() {
    return <Video file={'link-to-file' /* || videoByFile */} title="There is the video" />;
}
