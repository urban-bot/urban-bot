import React from 'react';
import { Location, useText } from '../src';

export function LocationExample() {
    const [latitude, setLatitude] = React.useState(60.734539);

    useText(({ text }) => {
        setLatitude(Number(text));
    });

    return <Location latitude={latitude} longitude={77.608548} livePeriod={500} />;
}
