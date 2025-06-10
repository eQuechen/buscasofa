import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

function PrivateRoute({ children }) {
    const { user } = useUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default PrivateRoute;