import React from 'react';
import { Poll, Option } from '@urban-bot/core';

export function PollExample() {
    return (
        <Poll question="How are you?">
            <Option>Awesome</Option>
            <Option>Fine</Option>
            <Option>Ok</Option>
            <Option>😐</Option>
        </Poll>
    );
}
