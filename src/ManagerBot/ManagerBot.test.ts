/* eslint-disable jest/no-commented-out-tests */
import { ManagerBot } from './ManagerBot';
import { UrbanExistingMessage, UrbanNewMessage } from '../types/Messages';

const testBot = {
    processUpdate: jest.fn(),
    sendMessage: jest.fn(),
    updateMessage: jest.fn(),
    deleteMessage: jest.fn(),
    initializeProcessUpdate: jest.fn(),
};

const meta = { messageId: 345 };
const chat = { id: '123' };
const newMessage: UrbanNewMessage = {
    nodeName: 'text',
    chat,
    data: { text: 'text' },
} as const;

const newMessage2: UrbanNewMessage = {
    nodeName: 'img',
    chat,
    data: { src: 'http://...' },
}

const existingMessage: UrbanExistingMessage<typeof meta> = {
    ...newMessage,
    meta,
} as const;

// eslint-disable-next-line no-unused-vars
// const testBotEmitter = {
//     on(event, listener) {
//         this[event] = listener;
//     },
//     emit(event, data) {
//         this[event](data);
//     },
// };

// FIXME rewrite broken tests
describe('ManagerBot', () => {
    // describe('method on', () => {
    //     const event = 'test-event';
    //     const listener = jest.fn();
    //
    //     afterEach(() => {
    //         listener.mockClear();
    //     });

    //     it('call inner bot method on', () => {
    //         const managerBot = new ManagerBot(testBot);
    //
    //         managerBot.on(event, listener);
    //
    //         expect(testBot.on).toHaveBeenCalledTimes(1);
    //         expect(testBot.on.mock.calls[0][0]).toBe(event);
    //         expect(testBot.on.mock.calls[0][1]).not.toBe(listener);
    //     });
    //
    //     it('call listener if chatId is empty', () => {
    //         const managerBot = new ManagerBot(testBotEmitter);
    //
    //         managerBot.on(event, listener);
    //         const data = { chat: { id: 123 } };
    //         const data2 = { chat: { id: 345 } };
    //
    //         testBotEmitter.emit(event, data);
    //
    //         expect(listener).toHaveBeenCalledTimes(1);
    //         expect(listener).toHaveBeenLastCalledWith(data);
    //
    //         testBotEmitter.emit(event, data2);
    //
    //         expect(listener).toHaveBeenCalledTimes(2);
    //         expect(listener).toHaveBeenLastCalledWith(data2);
    //     });
    //
    //     it('call listener if chatId is the same with emit data', () => {
    //         const managerBot = new ManagerBot(testBotEmitter);
    //
    //         const id = 123;
    //
    //         managerBot.on(event, listener, id);
    //         const data = { chat: { id } };
    //
    //         testBotEmitter.emit(event, data);
    //
    //         expect(listener).toHaveBeenCalledTimes(1);
    //         expect(listener).toHaveBeenLastCalledWith(data);
    //     });
    //
    //     it("doesn't call listener if chatId is not the same with emit data", () => {
    //         const managerBot = new ManagerBot(testBotEmitter);
    //
    //         const eventId = '123';
    //         const id = 123;
    //         const id2 = 345;
    //
    //         managerBot.on(event, listener, eventId, id);
    //         const data = { chat: { id: id2 } };
    //
    //         testBotEmitter.emit(event, data);
    //
    //         expect(listener).toHaveBeenCalledTimes(0);
    //     });
    // });
    //
    // it('method emit', () => {
    //     const managerBot = new ManagerBot(testBot);
    //
    //     const event = 'test-event';
    //     const listener = () => {};
    //
    //     managerBot.emit(event, listener);
    //
    //     expect(testBot.emit).toHaveBeenCalledTimes(1);
    //     expect(testBot.emit).toHaveBeenLastCalledWith(event, listener);
    //
    //     managerBot.emit(event, listener);
    //
    //     expect(testBot.emit).toHaveBeenCalledTimes(2);
    // });
    //
    // it('method removeListener', () => {
    //     const managerBot = new ManagerBot(testBot);
    //
    //     const event = 'test-event';
    //     const listener = () => {};
    //     const eventId = '123';
    //
    //     managerBot.removeListener(event, listener, eventId);
    //
    //     expect(testBot.removeListener).toHaveBeenCalledTimes(1);
    //     expect(testBot.removeListener).toHaveBeenLastCalledWith(event, listener, eventId);
    //
    //     managerBot.removeListener(event, listener, eventId);
    //
    //     expect(testBot.removeListener).toHaveBeenCalledTimes(2);
    // });

    it('method updateMessage', () => {
        const managerBot = new ManagerBot(testBot);

        managerBot.updateMessage(existingMessage);

        expect(testBot.updateMessage).toHaveBeenCalledTimes(1);
        expect(testBot.updateMessage).toHaveBeenLastCalledWith(existingMessage);

        managerBot.updateMessage(existingMessage);

        expect(testBot.updateMessage).toHaveBeenCalledTimes(2);
    });

    it('method deleteMessage', () => {
        const managerBot = new ManagerBot(testBot);

        managerBot.deleteMessage(existingMessage);

        expect(testBot.deleteMessage).toHaveBeenCalledTimes(1);
        expect(testBot.deleteMessage).toHaveBeenLastCalledWith(existingMessage);

        managerBot.deleteMessage(existingMessage);

        expect(testBot.deleteMessage).toHaveBeenCalledTimes(2);
    });

    describe('method sendMessage', () => {
        afterEach(() => {
            testBot.sendMessage.mockClear();
        });

        const nodeName2 = 'img';
        const data2 = { src: 'http://something' };

        it('send one message', () => {
            const managerBot = new ManagerBot(testBot);

            managerBot.addChat(existingMessage.chat.id);

            testBot.sendMessage.mockReturnValue(Promise.resolve());

            const res = managerBot.sendMessage(existingMessage);

            return res.then(() => {
                expect(testBot.sendMessage).toHaveBeenCalledTimes(1);
                expect(testBot.sendMessage).toHaveBeenLastCalledWith(existingMessage);
            });
        });

        it('send two messages', () => {
            const managerBot = new ManagerBot(testBot);

            managerBot.addChat(newMessage.chat.id);

            testBot.sendMessage.mockReturnValue(Promise.resolve());

            const res1 = managerBot.sendMessage(newMessage);
            const res2 = managerBot.sendMessage(newMessage2);

            return Promise.all([res1, res2]).then(() => {
                expect(testBot.sendMessage).toHaveBeenCalledTimes(2);
                expect(testBot.sendMessage).toHaveBeenCalledWith(newMessage);
                expect(testBot.sendMessage).toHaveBeenCalledWith(newMessage2);
            });
        });

        it('send next message only when previous was finished', () => {
            const managerBot = new ManagerBot(testBot);

            managerBot.addChat(newMessage.chat.id);

            // @ts-ignore
            const firstPromise = managerBot.chats.get(newMessage.chat.id)?.promiseQueue.last;

            if (firstPromise === undefined) {
                throw new Error('promiseQueue is not found');
            }

            testBot.sendMessage.mockReturnValueOnce(
                new Promise((resolve) => {
                    setTimeout(resolve, 1000);
                }),
            );
            const res1 = managerBot.sendMessage(newMessage);

            testBot.sendMessage.mockReturnValueOnce(Promise.resolve());
            managerBot.sendMessage(newMessage2);

            return firstPromise
                .then(() => {
                    expect(testBot.sendMessage).toHaveBeenNthCalledWith(1, newMessage);
                    expect(testBot.sendMessage).not.toHaveBeenCalledTimes(2);

                    return res1;
                })
                .then(() => {
                    expect(testBot.sendMessage).toHaveBeenNthCalledWith(2, newMessage2);
                });
        });

        it('throw error without initializing chatId', () => {
            const managerBot = new ManagerBot(testBot);

            expect(() => managerBot.sendMessage(newMessage)).toThrowErrorMatchingSnapshot();
        });

        it('throw error if send message after delete chatId', async () => {
            const managerBot = new ManagerBot(testBot);
            managerBot.addChat(newMessage.chat.id);
            testBot.sendMessage.mockReturnValue(Promise.resolve());

            await managerBot.sendMessage(newMessage);
            expect(testBot.sendMessage).toHaveBeenCalledTimes(1);

            managerBot.deleteChat(newMessage.chat.id);
            expect(() => managerBot.sendMessage(newMessage2)).toThrowErrorMatchingSnapshot();
        });
    });
});
