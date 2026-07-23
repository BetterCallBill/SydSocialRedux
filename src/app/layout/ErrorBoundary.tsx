import { Component, ErrorInfo, PropsWithChildren } from 'react';
import { Button, Container, Header, Segment } from 'semantic-ui-react';

type State = {
    hasError: boolean;
};

export default class ErrorBoundary extends Component<PropsWithChildren, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('Unhandled error caught by ErrorBoundary:', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Container text style={{ marginTop: '3em' }}>
                    <Segment placeholder>
                        <Header icon="exclamation triangle" content="Something went wrong" />
                        <p>An unexpected error occurred. Try reloading the page.</p>
                        <Button primary onClick={() => window.location.reload()}>
                            Reload
                        </Button>
                    </Segment>
                </Container>
            );
        }

        return this.props.children;
    }
}
