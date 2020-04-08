/* eslint-disable react/jsx-key */
import React from 'react';
import { formatElementToHTML } from './formatElementToHTML';

describe('formatText', () => {
    test('plain text', () => {
        expect(formatElementToHTML('text')).toBe('text');
    });

    test('bold', () => {
        expect(formatElementToHTML(<b>text</b>)).toBe('<b>text</b>');
        expect(formatElementToHTML([<b>text</b>, <b>text2</b>])).toBe('<b>text</b><b>text2</b>');
        expect(formatElementToHTML([<b>text</b>, ' ', <b>text2</b>])).toBe('<b>text</b> <b>text2</b>');
    });

    test('italic', () => {
        expect(formatElementToHTML(<i>text</i>)).toBe('<i>text</i>');
        expect(formatElementToHTML([<i>text</i>, <i>text2</i>])).toBe('<i>text</i><i>text2</i>');
    });

    test('underscore', () => {
        expect(formatElementToHTML(<u>text</u>)).toBe('<u>text</u>');
        expect(formatElementToHTML([<u>text</u>, <u>text2</u>])).toBe('<u>text</u><u>text2</u>');
    });

    test('strikethrough', () => {
        expect(formatElementToHTML(<s>text</s>)).toBe('<s>text</s>');
        expect(formatElementToHTML([<s>text</s>, <s>text2</s>])).toBe('<s>text</s><s>text2</s>');
    });

    test('code', () => {
        expect(formatElementToHTML(<code>text</code>)).toBe('<code>text</code>');
        expect(formatElementToHTML([<code>text</code>, <code>text2</code>])).toBe(
            '<code>text</code><code>text2</code>',
        );
    });

    test('pre', () => {
        expect(formatElementToHTML(<pre>text</pre>)).toBe('<pre>text</pre>');
        expect(formatElementToHTML([<pre>text</pre>, <pre>text2</pre>])).toBe('<pre>text</pre><pre>text2</pre>');
    });

    test('link', () => {
        expect(formatElementToHTML(<a href="http://www.example.com/">inline URL</a>)).toBe(
            '<a href="http://www.example.com/">inline URL</a>',
        );
        expect(
            formatElementToHTML([
                <a href="http://www.example.com/">inline URL</a>,
                <a href="http://www.example2.com/">inline URL2</a>,
            ]),
        ).toBe('<a href="http://www.example.com/">inline URL</a><a href="http://www.example2.com/">inline URL2</a>');
    });

    test('link user', () => {
        expect(formatElementToHTML(<a userId={123456789}>user URL</a>)).toBe(
            '<a href="tg://user?id=123456789">user URL</a>',
        );

        expect(formatElementToHTML(<a userId="123456789">user URL</a>)).toBe(
            '<a href="tg://user?id=123456789">user URL</a>',
        );
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
    });
});
