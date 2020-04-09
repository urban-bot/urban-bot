/* eslint-disable react/jsx-key */
import React from 'react';
import { formatElementToHTML } from './formatElementToHTML';

describe('formatText', () => {
    test('plain text', () => {
        expect(formatElementToHTML('text')).toBe('text');
    });

    test('bold', () => {
        expect(formatElementToHTML(<b>text</b>)).toBe('<b>text</b>');
    });

    test('italic', () => {
        expect(formatElementToHTML(<i>text</i>)).toBe('<i>text</i>');
    });

    test('underscore', () => {
        expect(formatElementToHTML(<u>text</u>)).toBe('<u>text</u>');
    });

    test('strikethrough', () => {
        expect(formatElementToHTML(<s>text</s>)).toBe('<s>text</s>');
    });

    test('code', () => {
        expect(formatElementToHTML(<code>text</code>)).toBe('<code>text</code>');
    });

    test('pre', () => {
        expect(formatElementToHTML(<pre>text</pre>)).toBe('<pre>text</pre>');
    });

    test('br', () => {
        expect(formatElementToHTML(<br />)).toBe('\n');
    });

    test('link', () => {
        expect(formatElementToHTML(<a href="http://www.example.com/">inline URL</a>)).toBe(
            '<a href="http://www.example.com/">inline URL</a>',
        );
    });

    test('link user', () => {
        expect(formatElementToHTML(<a userId={123456789}>user URL</a>)).toBe(
            '<a href="tg://user?id=123456789">user URL</a>',
        );

        expect(formatElementToHTML(<a userId="123456789">user URL</a>)).toBe(
            '<a href="tg://user?id=123456789">user URL</a>',
        );
    });

    test('react fragment', () => {
        expect(
            formatElementToHTML(
                <>
                    <b>text</b>
                    <b>text2</b>
                </>,
            ),
        ).toBe('<b>text</b><b>text2</b>');
        expect(
            formatElementToHTML(
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
        expect(formatElementToHTML(1)).toBe('1');
        expect(formatElementToHTML(NaN)).toBe('NaN');
        expect(formatElementToHTML([1, 2])).toBe('12');
        expect(formatElementToHTML([<b>{1}</b>, <b>{2}</b>])).toBe('<b>1</b><b>2</b>');
    });

    test('flat structure', () => {
        expect(formatElementToHTML([<b>text</b>, <b>text2</b>])).toBe('<b>text</b><b>text2</b>');
        expect(formatElementToHTML([<b>text</b>, ' ', <b>text2</b>])).toBe('<b>text</b> <b>text2</b>');
    });

    test('deep structure', () => {
        expect(
            formatElementToHTML(
                <b>
                    text <b>text2</b>
                </b>,
            ),
        ).toBe('<b>text <b>text2</b></b>');
        expect(
            formatElementToHTML([
                <b>
                    text <b>text2</b>
                </b>,
                ' ',
                <b>text2</b>,
            ]),
        ).toBe('<b>text <b>text2</b></b> <b>text2</b>');
        expect(
            formatElementToHTML([
                <b>
                    text <i>text2</i>
                </b>,
                ' ',
                <b>text2</b>,
            ]),
        ).toBe('<b>text <i>text2</i></b> <b>text2</b>');

        expect(
            formatElementToHTML(
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
            formatElementToHTML(
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
