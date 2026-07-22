/* eslint-disable react-refresh/only-export-components -- this is a router config module, not a component file; fast refresh doesn't apply */
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../layout/App';
import RequireAuth from './RequireAuth';
import UnauthComponent from '../layout/UnauthComponent';

const EventDashboard = lazy(() => import('../../features/events/dashboard/EventDashboard'));
const EventDetail = lazy(() => import('../../features/events/details/EventDetail'));
const EventForm = lazy(() => import('../../features/events/form/EventForm'));
const AccountPage = lazy(() => import('../../features/auth/AccoutPage'));
const ProfilePage = lazy(() => import('../../features/profiles/ProfilePage'));

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                element: <RequireAuth />,
                children: [
                    // oops you need auth
                    { path: '/manage/:id', element: <EventForm /> },
                    { path: '/profiles/:id', element: <ProfilePage /> },
                    { path: '/createEvent', element: <EventForm key="create" /> },
                    { path: '/account', element: <AccountPage /> },
                ],
            },
            { path: '/events', element: <EventDashboard /> },
            { path: '/events/:id', element: <EventDetail /> },
            { path: '/unauthorised', element: <UnauthComponent /> },
        ],
    },
]);