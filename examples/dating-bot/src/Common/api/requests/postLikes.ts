import { likes } from './moked/DB';
import { getApiHooksCreator } from '../helpers';
import { LikeStatus } from './types';

type Props = { userId: string; partnerId: string; likeStatus: LikeStatus };

export async function postLikeStatus({ userId, partnerId, likeStatus }: Props): Promise<void> {
    if (!likes.has(userId)) {
        likes.set(userId, new Map());
    }
    likes.get(userId)?.set(partnerId, likeStatus);
}

export const usePostLikeStatus = getApiHooksCreator(postLikeStatus);
