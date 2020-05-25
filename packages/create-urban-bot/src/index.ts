#!/usr/bin/env node
import { execSync } from 'child_process';
import path from 'path';

const outDir = process.argv[2] || 'urban-bot-app';

const commands = ['git clone https://github.com/urban-bot/urban-bot-starter.git ' + outDir, 'npx rimraf .git', 'npm i'];

commands.forEach((command, i) => {
    const dir = i > 0 ? outDir : '';
    const cwd = path.resolve(process.cwd(), dir);

    execSync(command, {
        stdio: [0, 1, 2], // we need this so node will print the command output
        cwd, // path to where you want to save the file
    });
});
