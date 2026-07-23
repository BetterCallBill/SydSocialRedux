import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LoadingComponent from './LoadingComponent';

describe('LoadingComponent', () => {
    it('renders the default loading message', () => {
        render(<LoadingComponent />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders a custom message when provided', () => {
        render(<LoadingComponent content="Fetching events..." />);
        expect(screen.getByText('Fetching events...')).toBeInTheDocument();
    });
});
