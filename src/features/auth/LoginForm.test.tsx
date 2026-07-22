import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signInWithEmailAndPassword } from 'firebase/auth';
import LoginForm from './LoginForm';
import { renderWithProviders } from '../../test/renderWithProviders';

vi.mock('../../app/config/firebase', () => ({ auth: {} }));
vi.mock('../../app/hooks/firestore/useFirestore', () => ({
    useFireStore: () => ({ set: vi.fn() }),
}));
vi.mock('firebase/auth', () => ({
    signInWithEmailAndPassword: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

async function fillAndSubmit(email: string, password: string) {
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('Email address'), email);
    await user.type(screen.getByPlaceholderText('Password'), password);
    await user.click(screen.getByRole('button', { name: 'Login' }));
}

describe('LoginForm', () => {
    beforeEach(() => {
        vi.mocked(signInWithEmailAndPassword).mockReset();
        mockNavigate.mockReset();
    });

    it('signs the user in and navigates on success', async () => {
        vi.mocked(signInWithEmailAndPassword).mockResolvedValueOnce({} as any);
        const { store } = renderWithProviders(<LoginForm />, {
            modals: { open: true, type: 'LoginForm', data: { from: '/events' } },
        });

        await fillAndSubmit('jane@example.com', 'password123');

        await waitFor(() => expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'jane@example.com', 'password123'));
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/events'));
        expect(store.getState().modals.open).toBe(false);
    });

    it('shows the server error message on failed login', async () => {
        vi.mocked(signInWithEmailAndPassword).mockRejectedValueOnce(new Error('Invalid credentials'));
        renderWithProviders(<LoginForm />, {
            modals: { open: true, type: 'LoginForm', data: { from: '/events' } },
        });

        await fillAndSubmit('jane@example.com', 'wrong-password');

        expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
