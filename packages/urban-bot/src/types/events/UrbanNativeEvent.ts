export interface UrbanNativeEvent<Type = any, Payload = any> {
    type: Type;
    payload?: Payload;
}
