import React from 'react';
import { useInterval } from '../hooks/useInterval';

export type NotificationProps = {
    children: React.ReactNode;
    interval: number;
};

export function Notification({ children, interval }: NotificationProps) {
    const [isActive, setIsActive] = React.useState(false);

    useInterval(() => {
        setIsActive(true);
        setIsActive(false);
    }, interval);

    if (!isActive) {
        return null;
    }

    const childrenArray = React.Children.toArray(children) as React.ReactElement<{ [key: string]: unknown }>[];

    return (
        <>
            {childrenArray.map((element) => {
                return React.cloneElement(element, { ...element.props, isNewMessageEveryRender: true });
            })}
        </>
    );
}
