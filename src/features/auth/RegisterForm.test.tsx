import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import RegisterForm from './RegisterForm';
import { renderWithProviders } from '../../test/renderWithProviders';

const mockSet = vi.fn();

vi.mock('../../app/config/firebase', () => ({ auth: {} }));
vi.mock('../../app/hooks/firestore/useFirestore', () => ({
    useFireStore: () => ({ set: mockSet }),
}));
vi.mock('firebase/auth', () => ({
    createUserWithEmailAndPassword: vi.fn(),
    updateProfile: vi.fn(),
}));

async function fillAndSubmit() {
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('Display name'), 'Jane Doe');
    await user.type(screen.getByPlaceholderText('Email address'), 'jane@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Register' }));
}

describe('RegisterForm', () => {
    beforeEach(() => {
        vi.mocked(createUserWithEmailAndPassword).mockReset();
        vi.mocked(updateProfile).mockReset();
        mockSet.mockReset();
    });

    it('creates the account, sets the profile, and signs the user in on success', async () => {
        const fakeUser = { uid: 'abc123', displayName: null, email: 'jane@example.com', photoURL: null, providerData: [{ providerId: 'password' }] };
        vi.mocked(createUserWithEmailAndPassword).mockResolvedValueOnce({ user: fakeUser } as any);
        vi.mocked(updateProfile).mockResolvedValueOnce(undefined);

        const { store } = renderWithProviders(<RegisterForm />, {
            modals: { open: true, type: 'RegisterForm', data: null },
        });

        await fillAndSubmit();

        await waitFor(() => expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'jane@example.com', 'password123'));
        expect(updateProfile).toHaveBeenCalledWith(fakeUser, { displayName: 'Jane Doe' });
        expect(mockSet).toHaveBeenCalledWith('abc123', expect.objectContaining({ displayName: 'Jane Doe', email: 'jane@example.com' }));
        await waitFor(() => expect(store.getState().auth.authenticated).toBe(true));
        expect(store.getState().modals.open).toBe(false);
    });

    it('shows the server error message when account creation fails', async () => {
        vi.mocked(createUserWithEmailAndPassword).mockRejectedValueOnce(new Error('Email already in use'));

        const { store } = renderWithProviders(<RegisterForm />, {
            modals: { open: true, type: 'RegisterForm', data: null },
        });

        await fillAndSubmit();

        expect(await screen.findByText('Email already in use')).toBeInTheDocument();
        expect(store.getState().auth.authenticated).toBe(false);
        expect(mockSet).not.toHaveBeenCalled();
    });
});
