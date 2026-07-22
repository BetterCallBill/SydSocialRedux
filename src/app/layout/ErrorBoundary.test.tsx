import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

function Bomb(): JSX.Element {
    throw new Error('boom');
}

describe('ErrorBoundary', () => {
    it('renders children when there is no error', () => {
        render(
            <ErrorBoundary>
                <div>safe content</div>
            </ErrorBoundary>
        );
        expect(screen.getByText('safe content')).toBeInTheDocument();
    });

    it('renders a fallback when a child throws', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        render(
            <ErrorBoundary>
                <Bomb />
            </ErrorBoundary>
        );
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        consoleSpy.mockRestore();
    });
});
