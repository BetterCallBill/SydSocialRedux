import { createBrowserRouter } from 'react-router-dom';
import App from '../layout/App';
import EventDashboard from '../../features/events/dashboard/EventDashboard';
import EventDetail from '../../features/events/details/EventDetail';
import EventForm from '../../features/events/form/EventForm';
import AccountPage from '../../features/auth/AccoutPage';
import ProfilePage from '../../features/profiles/ProfilePage';
import RequireAuth from './RequireAuth';
import UnauthComponent from '../layout/UnauthComponent';

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