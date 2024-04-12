import { createBrowserRouter } from 'react-router-dom';
import App from '../layout/App';
import EventDashboard from '../../features/events/dashboard/EventDashboard';
import EventDetail from '../../features/events/details/EventDetail';
import EventForm from '../../features/events/form/EventForm';
import AccountPage from '../../features/auth/AccoutPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '/events', element: <EventDashboard /> },
            { path: '/events/:id', element: <EventDetail /> },
            { path: '/manage/:id', element: <EventForm /> },
            { path: '/createEvent', element: <EventForm key='create' /> },
            { path: '/account', element: <AccountPage /> },
        ],
    },
]);
