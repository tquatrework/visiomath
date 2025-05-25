import { Navigate } from 'react-router-dom';

const RouteByRole = ({ children, allowedRoles, user }) => {
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  return children;
};
