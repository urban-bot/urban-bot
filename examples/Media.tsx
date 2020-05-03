import fs from 'fs';
import path from 'path';
import React from 'react';
import { useText, Media } from '../src';

const imageByFile = fs.readFileSync(path.join(__dirname, 'an-24.jpg'));
const videoByFile = fs.readFileSync(path.join(__dirname, 'video1.mp4'));

export function MediaExample() {
    const [_author, setAuthor] = React.useState('Some author');

    useText(({ text }) => {
        setAuthor(text);
    });

    return (
        <Media
            files={[
                {
                    type: 'image',
                    file:
                        'https://upload.wikimedia.org/wikipedia/commons/3/32/Aeroflot_Tu-154B-2_CCCP-85396_ZRH_1982-6-20.png',
                    title: 'image1',
                },
                {
                    type: 'image',
                    file: imageByFile,
                },
                {
                    type: 'video',
                    file: videoByFile,
                    title: 'video1',
                },
            ]}
        />
    );
}
