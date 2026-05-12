import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export function AdminRoute({ children }) {
  const { admin } = useAuth();
  return admin ? children : <Navigate to="/admin" replace />;
}
