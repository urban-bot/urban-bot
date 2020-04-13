export function formatButtonElement(element) {
    const mockCallback = () => {};
    const elementArray = Array.isArray(element) ? element : [element];

    return elementArray.map((child) => {
        const { children: text, onClick = mockCallback, ...other } = child.props;
        return { text, onClick, ...other };
    });
}
