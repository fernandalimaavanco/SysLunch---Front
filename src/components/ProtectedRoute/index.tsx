import { Navigate } from 'react-router-dom';
import { useContextSelector } from 'use-context-selector';
import { AuthContext } from '../../contexts/AuthContext';
interface ProtectedRouteProps {
    children: JSX.Element;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {

    const isAuthenticated = useContextSelector(AuthContext, (context) => context.isAuthenticated)

    return isAuthenticated ? children : <Navigate to="/login" />;
}