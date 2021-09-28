import { UrbanButton } from '@urban-bot/core';
import { EmojiResolvable, MessageActionRow, MessageButton } from 'discord.js';

function getRandomId() {
    return String(Math.random());
}

function formatUrbanButton(urbanButton: UrbanButton, row: MessageActionRow) {
    const newButton = new MessageButton().setLabel(urbanButton.text);

    if (urbanButton.url) {
        newButton.setURL(urbanButton.url);
        newButton.setStyle('LINK');
    } else {
        newButton.setCustomId(urbanButton.id ?? getRandomId());
        newButton.setStyle(urbanButton.style ?? 'PRIMARY');
    }

    if (urbanButton.isDisabled) {
        newButton.setDisabled(true);
    }

    if (urbanButton.emoji) {
        newButton.setEmoji(urbanButton.emoji as EmojiResolvable);
    }

    row.addComponents(newButton);
}

export function formatButtons(urbanButtons: UrbanButton[] | UrbanButton[][]): MessageActionRow[] {
    const formattedButtons: MessageActionRow[] = [];

    if (Array.isArray(urbanButtons[0])) {
        (urbanButtons as UrbanButton[][]).forEach((urbanButtonInner) => {
            const urbanButtonsArray = Array.isArray(urbanButtonInner) ? urbanButtonInner : [urbanButtonInner];
            const row = new MessageActionRow();
            urbanButtonsArray.forEach((urbanButton) => formatUrbanButton(urbanButton, row));
            formattedButtons.push(row);
        });
    } else {
        const row = new MessageActionRow();
        (urbanButtons as UrbanButton[]).forEach((urbanButton) => formatUrbanButton(urbanButton, row));
        formattedButtons.push(row);
    }

    return formattedButtons;
}
