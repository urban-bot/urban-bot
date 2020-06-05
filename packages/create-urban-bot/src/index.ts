#!/usr/bin/env node
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const outDir = process.argv[2] || 'urban-bot-app';

const template = getTemplate();

const commands = [
    `git clone https://github.com/urban-bot/urban-bot-starter-${template}.git ${outDir}`,
    'npx rimraf .git',
    'npm i',
];

commands.forEach((command, i) => {
    const dir = i > 0 ? outDir : '';
    const cwd = path.resolve(process.cwd(), dir);

    execSync(command, {
        stdio: [0, 1, 2], // we need this so node will print the command output
        cwd, // path to where you want to save the file
    });
});

renameEnvFile();

function renameEnvFile() {
    const cwd = path.resolve(process.cwd(), outDir);
    fs.renameSync(cwd + '/.env.example', cwd + '/.env');
}

function getTemplate() {
    const templateKeyIndex = process.argv.findIndex((arg) => {
        return arg === '--template';
    });

    if (templateKeyIndex === -1) {
        return 'typescript';
    }

    const templateShortName = process.argv[templateKeyIndex + 1];

    switch (templateShortName) {
        case 'js': {
            return 'javascript';
        }
        case 'ts': {
            return 'typescript';
        }
        default: {
            throw new Error('Template is not found. Use "ts" or "js"');
        }
    }
}
