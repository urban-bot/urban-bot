export const lang = {
    AGE: (birthday: Date): number => {
        const now = new Date();
        return now.getUTCFullYear() - birthday.getUTCFullYear();
    },
};
