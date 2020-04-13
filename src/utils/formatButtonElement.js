import { Button } from '../components/ButtonGroup';

export function formatButtonElement(element) {
    const mockCallback = () => {};
    const elementArray = Array.isArray(element) ? element : [element];

    return elementArray.map((child) => {
        if (child.type !== Button) {
            throw new Error('Please use only Button components inside ButtonGroup.');
        }

        const { children: text, onClick = mockCallback, id = String(Math.random()), ...other } = child.props;

        return { text, onClick, id, ...other };
    });
}
