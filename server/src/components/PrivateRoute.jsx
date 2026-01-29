import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { authState } = useAuth();

  if (!authState?.token) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(authState.details.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
