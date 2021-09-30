import { Button, ButtonGroup, Image, useRouter, useText } from '@urban-bot/core';
import React from 'react';

const imageByUrl =
    'https://upload.wikimedia.org/wikipedia/commons/3/32/Aeroflot_Tu-154B-2_CCCP-85396_ZRH_1982-6-20.png';
const imageByUrl2 = 'https://cdn.airlines-inform.ru/upload/iblock/b97/Antonov-An-24-2.jpg';

export function ImageExample() {
    const { navigate } = useRouter();
    const [title, setTitle] = React.useState('✈️');
    const [image, setImage] = React.useState(imageByUrl);

    useText(({ text }) => {
        setTitle(text);
    });

    function toggleImage() {
        setImage((image) => (image === imageByUrl ? imageByUrl2 : imageByUrl));
    }

    return (
        <Image
            file={image}
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
                    <Button onClick={toggleImage}>Toggle image</Button>
                </ButtonGroup>
            }
        />
    );
}
