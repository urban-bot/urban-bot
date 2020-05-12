// import fs from 'fs';
// import path from 'path';
import React from 'react';
import { File } from '@urban-bot/core';

// const file = fs.createReadStream(path.join(__dirname, 'file.doc'));

export function FileExample() {
    return <File file={'urlToFile' /* || file */} title="There is the file" />;
}
