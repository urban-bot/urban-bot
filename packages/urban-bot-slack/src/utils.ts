export function getTypeByMimeType(mimeType: string) {
    return mimeType.split('/')[0];
}
