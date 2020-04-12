import { ManagerBot } from './ManagerBot';

const testBot = {
    on: jest.fn(),
    emit: jest.fn(),
    sendMessage: jest.fn(),
    removeListener: jest.fn(),
    updateMessage: jest.fn(),
    deleteMessage: jest.fn(),
};

describe('ManagerBot', () => {
    it('on', () => {
        const managerBot = new ManagerBot(testBot);

        const event = 'test-event';
        const listener = () => {};

        managerBot.on(event, listener);

        expect(testBot.on).toHaveBeenCalledTimes(1);
        expect(testBot.on.mock.calls[0][0]).toBe(event);
    });

    it('emit', () => {
        const managerBot = new ManagerBot(testBot);

        const event = 'test-event';
        const listener = () => {};

        managerBot.emit(event, listener);

        expect(testBot.emit).toHaveBeenCalledTimes(1);
        expect(testBot.emit).toHaveBeenLastCalledWith(event, listener);

        managerBot.emit(event, listener);

        expect(testBot.emit).toHaveBeenCalledTimes(2);
    });

    it('removeListener', () => {
        const managerBot = new ManagerBot(testBot);

        const event = 'test-event';
        const listener = () => {};

        managerBot.removeListener(event, listener);

        expect(testBot.removeListener).toHaveBeenCalledTimes(1);
        expect(testBot.removeListener).toHaveBeenLastCalledWith(event, listener);

        managerBot.removeListener(event, listener);

        expect(testBot.removeListener).toHaveBeenCalledTimes(2);
    });

    it('updateMessage', () => {
        const managerBot = new ManagerBot(testBot);

        const nodeName = 'text';
        const chatId = 123;
        const data = { text: '123' };
        const meta = { messageId: 345 };
        managerBot.updateMessage(nodeName, chatId, data, meta);

        expect(testBot.updateMessage).toHaveBeenCalledTimes(1);
        expect(testBot.updateMessage).toHaveBeenLastCalledWith(nodeName, chatId, data, meta);

        managerBot.updateMessage(nodeName, chatId, data, meta);

        expect(testBot.updateMessage).toHaveBeenCalledTimes(2);
    });

    it('deleteMessage', () => {
        const managerBot = new ManagerBot(testBot);

        const nodeName = 'text';
        const chatId = 123;
        const data = { text: '123' };
        const meta = { messageId: 345 };
        managerBot.deleteMessage(nodeName, chatId, data, meta);

        expect(testBot.deleteMessage).toHaveBeenCalledTimes(1);
        expect(testBot.deleteMessage).toHaveBeenLastCalledWith(nodeName, chatId, data, meta);

        managerBot.deleteMessage(nodeName, chatId, data, meta);

        expect(testBot.deleteMessage).toHaveBeenCalledTimes(2);
    });
});
