import { getApiHooksCreator } from '../helpers';
import { profiles } from './moked/DB';
import { Profile } from './types';

export async function getProfile(id: string): Promise<Profile | undefined> {
    if (!profiles.has(id)) {
        throw Error('User not found');
    }
    return profiles.get(id);
}

export const useGetProfile = getApiHooksCreator(getProfile);
