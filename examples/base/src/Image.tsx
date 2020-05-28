import { Button, ButtonGroup, Image, useRouter, useText } from '@urban-bot/core';
import React from 'react';

const imageByUrl =
    'https://upload.wikimedia.org/wikipedia/commons/3/32/Aeroflot_Tu-154B-2_CCCP-85396_ZRH_1982-6-20.png';

export function ImageExample() {
    const { navigate } = useRouter();
    const [title, setTitle] = React.useState('✈️');

    useText(({ text }) => {
        setTitle(text);
    });

    return (
        <Image
            file={imageByUrl}
            title={title}
            alt="planes"
            buttons={
                <ButtonGroup>
                    <Button
                        onClick={() => {
                            setTitle(title + '✈️');
                        }}
                    >
                        Add plane
                    </Button>
                    <Button onClick={() => navigate('/text')}>Go to text</Button>
                </ButtonGroup>
            }
        />
    );
}
