/* eslint-disable react/jsx-key */
import { Button } from '../components';
import { formatButtonElement } from '../utils';
import { flatten } from 'array-flatten';

describe('formatButtonElement', () => {
    it('return right response for one button', () => {
        const text = 'test name';
        const id = String(Math.random());
        const onClick = () => {};
        const element = (
            <Button onClick={onClick} id={id}>
                {text}
            </Button>
        );

        expect(formatButtonElement(element)).toEqual([{ text, onClick, id }]);
    });

    it('return right response for two buttons', () => {
        const text1 = 'test name';
        const text2 = 'test name2';
        const id1 = String(Math.random());
        const id2 = String(Math.random());
        const onClick1 = () => {};
        const onClick2 = () => {};
        const element = [
            <Button onClick={onClick1} id={id1}>
                {text1}
            </Button>,
            <Button onClick={onClick2} id={id2}>
                {text2}
            </Button>,
        ];

        expect(formatButtonElement(element)).toEqual([
            { text: text1, onClick: onClick1, id: id1 },
            { text: text2, onClick: onClick2, id: id2 },
        ]);
    });

    it('add additional props to response', () => {
        const text = 'test name';
        const onClick = () => {};
        const id = String(Math.random());
        const customProp = true;
        const element = (
            <Button onClick={onClick} customProp={customProp} id={id}>
                {text}
            </Button>
        );

        expect(flatten(formatButtonElement(element))[0].customProp).toBe(customProp);
    });

    it('add random id by default', () => {
        const text = 'test name';
        const element = <Button onClick={() => {}}>{text}</Button>;

        expect(flatten(formatButtonElement(element))[0].id).toEqual(expect.any(String));
    });

    it('throw error if passed not Button', () => {
        function Text(_props: React.PropsWithChildren<unknown>) {
            return null;
        }

        const text = 'test name';
        const element = <Text>{text}</Text>;

        expect(() => formatButtonElement(element)).toThrowErrorMatchingSnapshot();
    });
});
