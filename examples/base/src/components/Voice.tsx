import React, { useState } from 'react';
import { Button, ButtonGroup, Voice, useVoice } from '@urban-bot/core';

const id1 = 'AwACAgIAAxkBAAIbYWW4hbA86S7SI3XoNuUfT1OHInLHAAINRQACDYvJSd97bucFzhRTNAQ';
const id2 = 'AwACAgIAAxkBAAIbY2W4hdJ4lx3EEbnLqdpfPjECSPOQAAIPRQACDYvJSbR4yXyZ0k7eNAQ';
const id3 = 'AwACAgIAAxkBAAIbaWW4hhS7aJvUzQhdBwNpY9IQX_YyAAISRQACDYvJScmZkNm90GJVNAQ';
const voices = [id1, id2, id3];

export function VoiceExample() {
    const [ind, setInd] = useState(0);

    const handlePrev = () => {
        setInd((prevId) => (prevId > 0 ? prevId - 1 : 2));
    };

    const handleNext = () => {
        setInd((prevId) => (prevId < 2 ? prevId + 1 : 0));
    };

    const buttons = (
        <ButtonGroup title="button title">
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

    return <Voice buttons={buttons} file={voices[ind]} title="There is the voice message" />;
}
