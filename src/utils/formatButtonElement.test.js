/* eslint-disable react/jsx-key */
import React from 'react';
import { formatButtonElement } from './formatButtonElement';
import { Button } from '../components/ButtonGroup';

describe('formatButtonElement', () => {
    it('return right response for one button', () => {
        const text = 'test name';
        const onClick = () => {};
        const element = <Button onClick={onClick}>{text}</Button>;

        expect(formatButtonElement(element)).toEqual([{ text, onClick }]);
    });

    it('return right response for two buttons', () => {
        const text1 = 'test name';
        const text2 = 'test name2';
        const onClick1 = () => {};
        const onClick2 = () => {};
        const element = [<Button onClick={onClick1}>{text1}</Button>, <Button onClick={onClick2}>{text2}</Button>];

        expect(formatButtonElement(element)).toEqual([
            { text: text1, onClick: onClick1 },
            { text: text2, onClick: onClick2 },
        ]);
    });

    it('add additional props to response', () => {
        const text = 'test name';
        const onClick = () => {};
        const customProp = true;
        const element = (
            <Button onClick={onClick} customProp={customProp}>
                {text}
            </Button>
        );

        expect(formatButtonElement(element)).toEqual([{ text, onClick, customProp }]);
    });

    it("add mock onClick if we don't pass it", () => {
        const text = 'test name';
        const element = <Button>{text}</Button>;

        expect(formatButtonElement(element)[0].onClick).toEqual(expect.any(Function));
    });
});
