import { Navigate, useLocation } from 'react-router-dom';
import { isAdminAuthenticated } from '../lib/adminAuth.js';

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAdminAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
