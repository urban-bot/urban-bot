/* eslint-disable react/jsx-key */
import React from 'react';
import { formatMarkupLanguageElement, MARKDOWN_MODE, HTML_MODE } from './formatMarkupLanguageElement';

describe('formatMarkupLanguageElement', () => {
    describe('HTML', () => {
        test('plain text', () => {
            expect(formatMarkupLanguageElement('text', HTML_MODE)).toBe('text');
        });

        test('bold', () => {
            expect(formatMarkupLanguageElement(<b>text</b>, HTML_MODE)).toBe('<b>text</b>');
        });

        test('italic', () => {
            expect(formatMarkupLanguageElement(<i>text</i>, HTML_MODE)).toBe('<i>text</i>');
        });

        test('underscore', () => {
            expect(formatMarkupLanguageElement(<u>text</u>, HTML_MODE)).toBe('<u>text</u>');
        });

        test('strikethrough', () => {
            expect(formatMarkupLanguageElement(<s>text</s>, HTML_MODE)).toBe('<s>text</s>');
        });

        test('code', () => {
            expect(formatMarkupLanguageElement(<code>text</code>, HTML_MODE)).toBe('<code>text</code>');
        });

        test('q', () => {
            expect(formatMarkupLanguageElement(<q>text</q>, HTML_MODE)).toBe('<q>text</q>');
        });

        test('pre', () => {
            expect(formatMarkupLanguageElement(<pre>text</pre>, HTML_MODE)).toBe('<pre>text</pre>');
        });

        test('br', () => {
            expect(formatMarkupLanguageElement(<br />, HTML_MODE)).toBe('\n');
        });

        test('link', () => {
            expect(formatMarkupLanguageElement(<a href="http://www.example.com">inline URL</a>, HTML_MODE)).toBe(
                '<a href="http://www.example.com">inline URL</a>',
            );
        });

        it('throw error if tag does not process', async () => {
            expect(() =>
                formatMarkupLanguageElement(<not-exist-tag>text</not-exist-tag>, HTML_MODE),
            ).toThrowErrorMatchingSnapshot();
        });

        test('react fragment', () => {
            expect(
                formatMarkupLanguageElement(
                    <>
                        <b>text</b>
                        <b>text2</b>
                    </>,
                    HTML_MODE,
                ),
            ).toBe('<b>text</b><b>text2</b>');
            expect(
                formatMarkupLanguageElement(
                    <>
                        <b>text</b>
                        <>
                            <b>text2</b> <b>text3</b>
                        </>
                        <b>text4</b>
                    </>,
                    HTML_MODE,
                ),
            ).toBe('<b>text</b><b>text2</b> <b>text3</b><b>text4</b>');
        });

        test('numbers', () => {
            expect(formatMarkupLanguageElement(1, HTML_MODE)).toBe('1');
            expect(formatMarkupLanguageElement(NaN, HTML_MODE)).toBe('NaN');
            expect(formatMarkupLanguageElement([1, 2], HTML_MODE)).toBe('12');
            expect(formatMarkupLanguageElement([<b>{1}</b>, <b>{2}</b>], HTML_MODE)).toBe('<b>1</b><b>2</b>');
        });

        test('flat structure', () => {
            expect(formatMarkupLanguageElement([<b>text</b>, <b>text2</b>], HTML_MODE)).toBe('<b>text</b><b>text2</b>');
            expect(formatMarkupLanguageElement([<b>text</b>, ' ', <b>text2</b>], HTML_MODE)).toBe(
                '<b>text</b> <b>text2</b>',
            );
        });

        test('deep structure', () => {
            expect(
                formatMarkupLanguageElement(
                    <b>
                        text <b>text2</b>
                    </b>,
                    HTML_MODE,
                ),
            ).toBe('<b>text <b>text2</b></b>');
            expect(
                formatMarkupLanguageElement(
                    [
                        <b>
                            text <b>text2</b>
                        </b>,
                        ' ',
                        <b>text2</b>,
                    ],
                    HTML_MODE,
                ),
            ).toBe('<b>text <b>text2</b></b> <b>text2</b>');
            expect(
                formatMarkupLanguageElement(
                    [
                        <b>
                            text <i>text2</i>
                        </b>,
                        ' ',
                        <b>text2</b>,
                    ],
                    HTML_MODE,
                ),
            ).toBe('<b>text <i>text2</i></b> <b>text2</b>');

            expect(
                formatMarkupLanguageElement(
                    <b>
                        bold{' '}
                        <i>
                            italic bold <s>italic bold strikethrough</s> <u>underline italic bold</u>
                        </i>{' '}
                        bold
                    </b>,
                    HTML_MODE,
                ),
            ).toBe('<b>bold <i>italic bold <s>italic bold strikethrough</s> <u>underline italic bold</u></i> bold</b>');

            expect(
                formatMarkupLanguageElement(
                    <b>
                        bold
                        <br />
                        <i>
                            italic bold <s>italic bold strikethrough</s> <u>underline italic bold</u>
                        </i>
                        <br />
                        bold
                    </b>,
                    HTML_MODE,
                ),
            ).toBe(
                '<b>bold\n<i>italic bold <s>italic bold strikethrough</s> <u>underline italic bold</u></i>\nbold</b>',
            );
        });
    });

    describe('markdown', () => {
        test('plain text', () => {
            expect(formatMarkupLanguageElement('text', MARKDOWN_MODE)).toBe('text');
        });

        test('bold', () => {
            expect(formatMarkupLanguageElement(<b>text</b>, MARKDOWN_MODE)).toBe('*text*');
        });

        test('italic', () => {
            expect(formatMarkupLanguageElement(<i>text</i>, MARKDOWN_MODE)).toBe('_text_');
        });

        test('underscore', () => {
            expect(formatMarkupLanguageElement(<u>text</u>, MARKDOWN_MODE)).toBe('text');
        });

        test('strikethrough', () => {
            expect(formatMarkupLanguageElement(<s>text</s>, MARKDOWN_MODE)).toBe('~text~');
        });

        test('code', () => {
            expect(formatMarkupLanguageElement(<code>text</code>, MARKDOWN_MODE)).toBe('`text`');
        });

        test('pre', () => {
            expect(formatMarkupLanguageElement(<pre>text</pre>, MARKDOWN_MODE)).toBe('```text```');
        });

        test('br', () => {
            expect(formatMarkupLanguageElement(<br />, MARKDOWN_MODE)).toBe('\n');
        });

        test('q', () => {
            expect(formatMarkupLanguageElement(<q>text</q>, MARKDOWN_MODE)).toBe('> text');
        });

        test('link', () => {
            expect(formatMarkupLanguageElement(<a href="http://www.example.com">inline URL</a>, MARKDOWN_MODE)).toBe(
                '<http://www.example.com|inline URL>',
            );
        });
    });

    describe('not right parseMode', () => {
        test('throw error if parseMode does npt exist', () => {
            expect(() => formatMarkupLanguageElement(<b>text</b>, 'notRightParseMode')).toThrowErrorMatchingSnapshot();
        });
    });
});
