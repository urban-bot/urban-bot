export type Profile = {
    id: string;
    name: string;
    birthday: Date;
    description: string;
    avatar: string;
};

export enum LikeStatus {
    LIKE = 'LIKE',
    DISLIKE = 'DISLIKE',
}
