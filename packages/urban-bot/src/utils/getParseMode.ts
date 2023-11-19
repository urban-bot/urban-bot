import React from 'react';
import type { UrbanParseMode } from '../types';

export function getParseMode(
    element: React.ReactNode,
    parseModeProp?: UrbanParseMode,
    parseModeContext?: UrbanParseMode,
    parseModeDefault?: UrbanParseMode,
): UrbanParseMode | undefined {
    let finalParseMode = parseModeProp ?? parseModeContext;
    if (React.isValidElement(element) || Array.isArray(element)) {
        finalParseMode = finalParseMode ?? parseModeDefault;
    }

    return finalParseMode;
}
