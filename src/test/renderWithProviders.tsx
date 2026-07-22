import { configureStore, ReducersMapObject } from '@reduxjs/toolkit';
import { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { eventSlice } from '../features/events/eventSlice';
import { modalSlice } from '../app/common/modals/modalSlice';
import { authSlice } from '../features/auth/authSlice';
import { profileSlice } from '../features/profiles/profileSlice';
import { photoSlice } from '../features/profiles/photoSlice';
import { followSlice } from '../features/profiles/follow/followSlice';
import { RootState } from '../app/store/store';

const rootReducer: ReducersMapObject<RootState> = {
    events: eventSlice.reducer,
    modals: modalSlice.reducer,
    auth: authSlice.reducer,
    profiles: profileSlice.reducer,
    photos: photoSlice.reducer,
    follows: followSlice.reducer,
};

export function renderWithProviders(ui: ReactElement, preloadedState?: Partial<RootState>) {
    const store = configureStore({ reducer: rootReducer, preloadedState: preloadedState as RootState });
    return {
        store,
        ...render(
            <Provider store={store}>
                <MemoryRouter>{ui}</MemoryRouter>
            </Provider>
        ),
    };
}
