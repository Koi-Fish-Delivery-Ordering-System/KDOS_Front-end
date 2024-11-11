import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles, ...rest }) => {
  const roles = JSON.parse(sessionStorage.getItem("roles")); // Assuming roles are stored in session storage
  const isAuthorized = roles && roles.some(role => allowedRoles.includes(role));

  return (
    <Route
      {...rest}
      element={isAuthorized ? element : <Navigate to="/unauthorized" />} // Redirect to unauthorized page if not authorized
    />
  );
};

export default ProtectedRoute;