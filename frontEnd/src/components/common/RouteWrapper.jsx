import React from "react";
import { useLocation } from "react-router-dom";
import { Route } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { getUser } from "../../auth";

const RouteWrapper = ({
  protect = false,
  redirect = true,
  component: Component,
  ...rest
}) => {
  const location = useLocation();
  const handleRouting = () => {
    const data = getUser();

    if (protect) {
      if (data && data.isAuthenticated) {
        return <Route {...rest} render={(props) => <Component {...props} />} />;
      } else {
        if (redirect)
          return (
            <Redirect
              to={{ pathname: "/signin", state: { from: location.pathname } }}
            />
          );
        else return null;
      }
    } else {
      if (!data) {
        return <Route {...rest} render={(props) => <Component {...props} />} />;
      } else {
        if (redirect) return <Redirect to={{ pathname: "/" }} />;
        else return null;
      }
    }
  };

  return handleRouting();
};

export default RouteWrapper;
