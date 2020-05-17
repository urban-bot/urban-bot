import { useCommand } from '@urban-bot/core';

export function useCommandWithParameters<P extends (string | undefined)[]>(
    expectedCommand: string,
    func: (...props: P) => void,
) {
    useCommand(({ command }) => {
        if (command.includes(`${expectedCommand} `)) {
            const props = command.replace(`${expectedCommand} `, '');
            func(...(props.split(' ') as P));
        }
    });
}
