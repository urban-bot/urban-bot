import { likes } from './moked/DB';
import { getApiHooksCreator } from '../helpers';
import { LikeStatus } from './types';

type Props = { userId: string; partnerId: string; likeStatus: LikeStatus };

export async function getLikes({ userId }: Props): Promise<Map<string, LikeStatus>> {
    if (!likes.has(userId)) {
        likes.set(userId, new Map());
    }

    return likes.get(userId) as Map<string, LikeStatus>;
}

export const useGetLikeStatus = getApiHooksCreator(getLikes);
