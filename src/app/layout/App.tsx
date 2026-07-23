import { Container } from 'semantic-ui-react';
import NavBar from './nav/NavBar';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ModalManager from '../common/modals/ModalManager';
import { Suspense, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useAppDispatch } from '../store/store';
import { auth } from '../config/firebase';
import { logout, signIn } from '../../features/auth/authSlice';
import LoadingComponent from './LoadingComponent';

function App() {
    const location = useLocation();
    const dispatch = useAppDispatch();

    useEffect(() => {
        onAuthStateChanged(auth, {
            next: user => {
                if (user) {
                    dispatch(signIn(user));
                } else {
                    dispatch(logout());
                }
            },
            error: error => console.log(error),
            complete: () => {},
        });
    }, [dispatch]);

    return (
        <>
            {location.pathname === '/' ? (
                <HomePage />
            ) : (
                <>
                    <ScrollRestoration />
                    <ModalManager />
                    <NavBar />
                    <Container className="main">
                        <Suspense fallback={<LoadingComponent />}>
                            <Outlet />
                        </Suspense>
                    </Container>
                </>
            )}
        </>
    );
}

export default App;