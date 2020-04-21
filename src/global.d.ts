declare global {
    namespace JSX {
        export interface IntrinsicElements {
            text: any;
        }
    }
}

// declare namespace JSX {
//     interface IntrinsicElements {
//         text1: { [key: string]: any };
//     }
// }

// declare namespace JSX {
//     interface IntrinsicElements {
//         text1: { requiredProp: string; optionalProp?: number };
//     }
// }
