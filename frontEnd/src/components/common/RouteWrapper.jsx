import React from "react";
import { useLocation, Route, Navigate } from "react-router-dom";
import { getUser } from "../../auth";

const RouteWrapper = ({
  protect = false,
  redirect = true,
  component: Component,
  ...rest
}) => {
  const location = useLocation();
  const data = getUser();

  if (protect) {
    if (data && data.isAuthenticated) {
      return <Route {...rest} element={<Component />} />;
    } else {
      if (redirect)
        return (
          <Route
            {...rest}
            element={<Navigate to="/signin" state={{ from: location.pathname }} replace />}
          />
        );
      else return null;
    }
  } else {
    if (!data) {
      return <Route {...rest} element={<Component />} />;
    } else {
      if (redirect) return <Route {...rest} element={<Navigate to="/" replace />} />;
      else return null;
    }
  }
};

export default RouteWrapper;
