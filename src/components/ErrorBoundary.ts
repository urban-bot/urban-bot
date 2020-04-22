import React from 'react';

type Props = {};

export class ErrorBoundary extends React.Component {
    state: {
        hasError: boolean;
    };

    constructor(props: Props) {
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
