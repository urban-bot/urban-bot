/* eslint-disable react/jsx-key */
import React from 'react';
import { formatHTMLElement, MARKDOWN_MODE } from './formatHTMLElement';

describe('formatText', () => {
    test('plain text', () => {
        expect(formatHTMLElement('text')).toBe('text');
    });

    test('bold', () => {
        expect(formatHTMLElement(<b>text</b>)).toBe('<b>text</b>');
    });

    test('italic', () => {
        expect(formatHTMLElement(<i>text</i>)).toBe('<i>text</i>');
    });

    test('underscore', () => {
        expect(formatHTMLElement(<u>text</u>)).toBe('<u>text</u>');
    });

    test('strikethrough', () => {
        expect(formatHTMLElement(<s>text</s>)).toBe('<s>text</s>');
    });

    test('code', () => {
        expect(formatHTMLElement(<code>text</code>)).toBe('<code>text</code>');
    });

    test('q', () => {
        expect(formatHTMLElement(<q>text</q>)).toBe('<q>text</q>');
    });

    test('pre', () => {
        expect(formatHTMLElement(<pre>text</pre>)).toBe('<pre>text</pre>');
    });

    test('br', () => {
        expect(formatHTMLElement(<br />)).toBe('\n');
    });

    test('link', () => {
        expect(formatHTMLElement(<a href="http://www.example.com">inline URL</a>)).toBe(
            '<a href="http://www.example.com">inline URL</a>',
        );
    });

    it('throw error if tag does not process', async () => {
        expect(() => formatHTMLElement(<not-exist-tag>text</not-exist-tag>)).toThrowErrorMatchingSnapshot();
    });

    test('react fragment', () => {
        expect(
            formatHTMLElement(
                <>
                    <b>text</b>
                    <b>text2</b>
                </>,
            ),
        ).toBe('<b>text</b><b>text2</b>');
        expect(
            formatHTMLElement(
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
        expect(formatHTMLElement(1)).toBe('1');
        expect(formatHTMLElement(NaN)).toBe('NaN');
        expect(formatHTMLElement([1, 2])).toBe('12');
        expect(formatHTMLElement([<b>{1}</b>, <b>{2}</b>])).toBe('<b>1</b><b>2</b>');
    });

    test('flat structure', () => {
        expect(formatHTMLElement([<b>text</b>, <b>text2</b>])).toBe('<b>text</b><b>text2</b>');
        expect(formatHTMLElement([<b>text</b>, ' ', <b>text2</b>])).toBe('<b>text</b> <b>text2</b>');
    });

    test('deep structure', () => {
        expect(
            formatHTMLElement(
                <b>
                    text <b>text2</b>
                </b>,
            ),
        ).toBe('<b>text <b>text2</b></b>');
        expect(
            formatHTMLElement([
                <b>
                    text <b>text2</b>
                </b>,
                ' ',
                <b>text2</b>,
            ]),
        ).toBe('<b>text <b>text2</b></b> <b>text2</b>');
        expect(
            formatHTMLElement([
                <b>
                    text <i>text2</i>
                </b>,
                ' ',
                <b>text2</b>,
            ]),
        ).toBe('<b>text <i>text2</i></b> <b>text2</b>');

        expect(
            formatHTMLElement(
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
            formatHTMLElement(
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

    describe('markdown', () => {
        test('plain text', () => {
            expect(formatHTMLElement('text', MARKDOWN_MODE)).toBe('text');
        });

        test('bold', () => {
            expect(formatHTMLElement(<b>text</b>, MARKDOWN_MODE)).toBe('*text*');
        });

        test('italic', () => {
            expect(formatHTMLElement(<i>text</i>, MARKDOWN_MODE)).toBe('_text_');
        });

        test('underscore', () => {
            expect(formatHTMLElement(<u>text</u>, MARKDOWN_MODE)).toBe('text');
        });

        test('strikethrough', () => {
            expect(formatHTMLElement(<s>text</s>, MARKDOWN_MODE)).toBe('~text~');
        });

        test('code', () => {
            expect(formatHTMLElement(<code>text</code>, MARKDOWN_MODE)).toBe('`text`');
        });

        test('pre', () => {
            expect(formatHTMLElement(<pre>text</pre>, MARKDOWN_MODE)).toBe('```text```');
        });

        test('br', () => {
            expect(formatHTMLElement(<br />, MARKDOWN_MODE)).toBe('\n');
        });

        test('q', () => {
            expect(formatHTMLElement(<q>text</q>, MARKDOWN_MODE)).toBe('> text');
        });

        test('link', () => {
            expect(formatHTMLElement(<a href="http://www.example.com">inline URL</a>, MARKDOWN_MODE)).toBe(
                '<http://www.example.com|inline URL>',
            );
        });
    });
});
