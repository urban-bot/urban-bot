import { useState } from 'react';

export function useCount() {
    const [count, setCount] = useState(0);

    function raiseCount() {
        setCount((prevCount) => prevCount + 1);
    }

    return { count, raiseCount };
}