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

    describe('sendMessage', () => {
        afterEach(() => {
            testBot.sendMessage.mockClear();
        });

        const nodeName = 'text';
        const chatId = 123;
        const data = { text: '123' };

        const nodeName2 = 'img';
        const data2 = { src: 'http://something' };

        it('send one message', () => {
            const managerBot = new ManagerBot(testBot);

            managerBot.addChat(chatId);

            testBot.sendMessage.mockReturnValue(Promise.resolve());

            const res = managerBot.sendMessage(nodeName, chatId, data);

            return res.then(() => {
                expect(testBot.sendMessage).toHaveBeenCalledTimes(1);
                expect(testBot.sendMessage).toHaveBeenLastCalledWith(nodeName, chatId, data);
            });
        });

        it('send two messages', () => {
            const managerBot = new ManagerBot(testBot);

            managerBot.addChat(chatId);

            testBot.sendMessage.mockReturnValue(Promise.resolve());

            const res1 = managerBot.sendMessage(nodeName, chatId, data);
            const res2 = managerBot.sendMessage(nodeName2, chatId, data2);

            return Promise.all([res1, res2]).then(() => {
                expect(testBot.sendMessage).toHaveBeenCalledTimes(2);
                expect(testBot.sendMessage).toHaveBeenCalledWith(nodeName, chatId, data);
                expect(testBot.sendMessage).toHaveBeenCalledWith(nodeName2, chatId, data2);
            });
        });

        it('send next message only when previous was finished', () => {
            const managerBot = new ManagerBot(testBot);

            managerBot.addChat(chatId);

            const firstPromise = managerBot.promiseQueueMap.get(chatId).last;

            testBot.sendMessage.mockReturnValueOnce(
                new Promise((resolve) => {
                    setTimeout(resolve, 1000);
                }),
            );
            const res1 = managerBot.sendMessage(nodeName, chatId, data);

            testBot.sendMessage.mockReturnValueOnce(Promise.resolve());
            managerBot.sendMessage(nodeName2, chatId, data2);

            return firstPromise
                .then(() => {
                    expect(testBot.sendMessage).toHaveBeenNthCalledWith(1, nodeName, chatId, data);
                    expect(testBot.sendMessage).not.toHaveBeenCalledTimes(2);

                    return res1;
                })
                .then(() => {
                    expect(testBot.sendMessage).toHaveBeenNthCalledWith(2, nodeName2, chatId, data2);
                });
        });

        it('throw error without initializing chatId', () => {
            const managerBot = new ManagerBot(testBot);

            expect(() => managerBot.sendMessage(nodeName, chatId, data)).toThrowErrorMatchingSnapshot();
        });

        it('throw error if send message after delete chatId', async () => {
            const managerBot = new ManagerBot(testBot);
            managerBot.addChat(chatId);
            testBot.sendMessage.mockReturnValue(Promise.resolve());

            await managerBot.sendMessage(nodeName, chatId, data);
            expect(testBot.sendMessage).toHaveBeenCalledTimes(1);

            managerBot.deleteChat(chatId);
            expect(() => managerBot.sendMessage(nodeName2, chatId, data2)).toThrowErrorMatchingSnapshot();
        });
    });
});
