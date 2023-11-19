import { Component } from 'react';
import type { PropsWithChildren } from 'react';

export class ErrorBoundary extends Component<PropsWithChildren<{}>> {
    state: {
        hasError: boolean;
    };

    constructor(props: React.PropsWithChildren<{}>) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        console.error(error);
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return null;
        }

        return this.props.children;
    }
}
