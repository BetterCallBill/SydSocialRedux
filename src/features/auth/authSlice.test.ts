import { describe, expect, it } from 'vitest';
import { User } from 'firebase/auth';
import { authSlice, logout, signIn } from './authSlice';

const initialState = {
    authenticated: false,
    currentUser: null,
    initialised: false,
};

function makeUser(overrides: Partial<User> = {}): User {
    return {
        uid: 'abc123',
        email: 'jane@example.com',
        photoURL: null,
        displayName: 'Jane',
        providerData: [{ providerId: 'password' }],
        ...overrides,
    } as unknown as User;
}

describe('authSlice', () => {
    it('starts unauthenticated', () => {
        expect(authSlice.reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });

    it('signIn marks the user authenticated and maps the Firebase user to AppUser', () => {
        const state = authSlice.reducer(initialState, signIn(makeUser()));

        expect(state.authenticated).toBe(true);
        expect(state.initialised).toBe(true);
        expect(state.currentUser).toEqual({
            uid: 'abc123',
            email: 'jane@example.com',
            photoURL: null,
            displayName: 'Jane',
            providerId: 'password',
        });
    });

    it('logout clears the authenticated user', () => {
        const signedIn = authSlice.reducer(initialState, signIn(makeUser()));
        const state = authSlice.reducer(signedIn, logout());

        expect(state).toEqual(initialState);
    });
});
