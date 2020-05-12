import { UrbanParseMode } from '../types';

export function getDefaultParseMode(botType: string): UrbanParseMode | undefined {
    switch (botType) {
        case 'TELEGRAM': {
            return 'HTML';
        }
        case 'SLACK': {
            return 'markdown';
        }
        default: {
            return undefined;
        }
    }
}
