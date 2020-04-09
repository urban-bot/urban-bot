/* eslint-disable react/jsx-key */
import React from 'react';
import { formatElementToString } from './formatElementToString';

describe('formatText', () => {
    test('plain text', () => {
        expect(formatElementToString('text')).toBe('text');
    });

    test('bold', () => {
        expect(formatElementToString(<b>text</b>)).toBe('<b>text</b>');
    });

    test('italic', () => {
        expect(formatElementToString(<i>text</i>)).toBe('<i>text</i>');
    });

    test('underscore', () => {
        expect(formatElementToString(<u>text</u>)).toBe('<u>text</u>');
    });

    test('strikethrough', () => {
        expect(formatElementToString(<s>text</s>)).toBe('<s>text</s>');
    });

    test('code', () => {
        expect(formatElementToString(<code>text</code>)).toBe('<code>text</code>');
    });

    test('pre', () => {
        expect(formatElementToString(<pre>text</pre>)).toBe('<pre>text</pre>');
    });

    test('br', () => {
        expect(formatElementToString(<br />)).toBe('\n');
    });

    test('link', () => {
        expect(formatElementToString(<a href="http://www.example.com/">inline URL</a>)).toBe(
            '<a href="http://www.example.com/">inline URL</a>',
        );
    });

    test('link user', () => {
        expect(formatElementToString(<a userId={123456789}>user URL</a>)).toBe(
            '<a href="tg://user?id=123456789">user URL</a>',
        );

        expect(formatElementToString(<a userId="123456789">user URL</a>)).toBe(
            '<a href="tg://user?id=123456789">user URL</a>',
        );
    });

    test('react fragment', () => {
        expect(
            formatElementToString(
                <>
                    <b>text</b>
                    <b>text2</b>
                </>,
            ),
        ).toBe('<b>text</b><b>text2</b>');
        expect(
            formatElementToString(
                <>
                    <b>text</b>
                    <>
                        <b>text2</b> <b>text3</b>
                    </>
                    <b>text4</b>
                </>,
            ),
        ).toBe('<b>text</b><b>text2</b> <b>text3</b><b>text4</b>');
    });

    test('numbers', () => {
        expect(formatElementToString(1)).toBe('1');
        expect(formatElementToString(NaN)).toBe('NaN');
        expect(formatElementToString([1, 2])).toBe('12');
        expect(formatElementToString([<b>{1}</b>, <b>{2}</b>])).toBe('<b>1</b><b>2</b>');
    });

    test('flat structure', () => {
        expect(formatElementToString([<b>text</b>, <b>text2</b>])).toBe('<b>text</b><b>text2</b>');
        expect(formatElementToString([<b>text</b>, ' ', <b>text2</b>])).toBe('<b>text</b> <b>text2</b>');
    });

    test('deep structure', () => {
        expect(
            formatElementToString(
                <b>
                    text <b>text2</b>
                </b>,
            ),
        ).toBe('<b>text <b>text2</b></b>');
        expect(
            formatElementToString([
                <b>
                    text <b>text2</b>
                </b>,
                ' ',
                <b>text2</b>,
            ]),
        ).toBe('<b>text <b>text2</b></b> <b>text2</b>');
        expect(
            formatElementToString([
                <b>
                    text <i>text2</i>
                </b>,
                ' ',
                <b>text2</b>,
            ]),
        ).toBe('<b>text <i>text2</i></b> <b>text2</b>');

        expect(
            formatElementToString(
                <b>
                    bold{' '}
                    <i>
                        italic bold <s>italic bold strikethrough</s> <u>underline italic bold</u>
                    </i>{' '}
                    bold
                </b>,
            ),
        ).toBe('<b>bold <i>italic bold <s>italic bold strikethrough</s> <u>underline italic bold</u></i> bold</b>');

        expect(
            formatElementToString(
                <b>
                    bold
                    <br />
                    <i>
                        italic bold <s>italic bold strikethrough</s> <u>underline italic bold</u>
                    </i>
                    <br />
                    bold
                </b>,
            ),
        ).toBe('<b>bold\n<i>italic bold <s>italic bold strikethrough</s> <u>underline italic bold</u></i>\nbold</b>');
    });
});
