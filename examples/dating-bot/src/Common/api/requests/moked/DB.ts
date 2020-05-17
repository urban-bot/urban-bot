import { getMockedProfile } from './profile';
import { LikeStatus, Profile } from '../types';

export const profiles = new Map<string, Profile>();
export const likes = new Map<string, Map<string, LikeStatus>>();

export function initializeMockedDB() {
    for (let i = 0; i < 20; i++) {
        const profile = getMockedProfile(String(i));
        profiles.set(profile.id, profile);
    }
}
