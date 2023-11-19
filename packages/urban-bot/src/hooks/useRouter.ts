import { useContext } from 'react';
import { RouterContext } from '../context';
import type { RouterQuery } from '../context';

export function useRouter<P extends object = {}, Q = RouterQuery>() {
    const routerContext = useContext(RouterContext);

    if (routerContext === undefined) {
        throw new Error('You should use useBotContext only under Router component');
    }

    return routerContext as RouterContext<P, Q>;
}
