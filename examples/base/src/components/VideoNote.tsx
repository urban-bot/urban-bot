// import fs from 'fs';
// import path from 'path';
import React, { useState } from 'react';
import { Button, ButtonGroup, VideoNote } from '@urban-bot/core';

const id1 = 'DQACAgIAAxkBAAIbRWW4g9PQ9UD9VUMU0yGHuOw5PmmIAALZRAACDYvJSVmIuA37OpxmNAQ';
const id2 = 'DQACAgIAAxkBAAIbP2W4g2W6qR4bWkFPcej6S7iNZFXEAAK-RAACDYvJSXGIh9_SdQZ3NAQ';
const id3 = 'DQACAgIAAxkBAAIbSmW4hCDCnRpbEZ9iHKcw7ZFP7FICAALmRAACDYvJSfzJKb1MVFHoNAQ';
const videos = [id1, id2, id3];

export function VideoNoteExample() {
    const [ind, setInd] = useState(0);

    const handlePrev = () => {
        setInd((prevId) => (prevId > 0 ? prevId - 1 : 2));
    };

    const handleNext = () => {
        setInd((prevId) => (prevId < 2 ? prevId + 1 : 0));
    };

    const buttons = (
        <ButtonGroup title={'text'}>
            {[
                <Button key="prev" onClick={handlePrev}>
                    prev
                </Button>,
                <Button key="next" onClick={handleNext}>
                    next
                </Button>,
            ]}
        </ButtonGroup>
    );

    return <VideoNote buttons={buttons} file={videos[ind]} />;
}
