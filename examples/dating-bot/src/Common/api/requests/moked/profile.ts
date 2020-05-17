import faker from 'faker';
import { Profile } from '../types';

export function getMockedProfile(id: string): Profile {
    return {
        id,
        birthday: faker.date.between('1980', '2002'),
        avatar: faker.image.avatar(),
        description: faker.lorem.paragraph(),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
}
