import { useState, Children, cloneElement } from 'react';
import { useInterval } from '../hooks/useInterval';
import type { ReactNode, ReactElement } from 'react';

export type NotificationProps = {
    children: ReactNode;
    intervalSeconds: number;
};

export function Notification({ children, intervalSeconds }: NotificationProps) {
    const [isActive, setIsActive] = useState(false);

    useInterval(() => {
        setIsActive(true);
        setIsActive(false);
    }, intervalSeconds * 1000);

    if (!isActive) {
        return null;
    }

    const childrenArray = Children.toArray(children) as ReactElement<{ [key: string]: unknown }>[];

    return (
        <>
            {childrenArray.map((element) => {
                return cloneElement(element, { ...element.props, isNewMessageEveryRender: true });
            })}
        </>
    );
}
