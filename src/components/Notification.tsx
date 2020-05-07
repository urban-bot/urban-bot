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

    return <>{children}</>;
}
