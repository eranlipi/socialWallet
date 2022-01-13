import React, { createContext, useState } from "react";
import { Switch } from "react-router-dom";
import RouteWrapper from "./components/common/RouteWrapper";
import Login from "./screens/login";
import Register from "./screens/register";
import Cards from "./screens/cards";
import Home from "./screens/home";
import Account from "./screens/account";
import Header from "./components/header";
import Footer from "./components/footer";
import Alert from "./components/common/Alert";
import Verify from "./screens/thirdPartyAuth/verify";
import Wrapper from "./components/common/Wrapper";

export const AlertContext = createContext(null);

const AppRouter = () => {
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);

  return (
    <AlertContext.Provider
      value={{
        alertMsg,
        setAlertMsg,
        alertType,
        setAlertType,
        alertOpen,
        setAlertOpen,
      }}
    >
      <RouteWrapper
        protect={true}
        redirect={false}
        exact
        path="*"
        component={Header}
      />
      <Wrapper>
        <Switch>
          <RouteWrapper exact path="/signin" component={Login} />
          <RouteWrapper exact path="/signup" component={Register} />
          <RouteWrapper exact path="/google/verify/:token" component={Verify} />
          <RouteWrapper protect={true} exact path="/cards" component={Cards} />
          <RouteWrapper
            protect={true}
            exact
            path="/editProfile"
            component={Account}
          />
          <RouteWrapper protect={true} exact path="/" component={Home} />
        </Switch>
      </Wrapper>
      <RouteWrapper
        protect={true}
        redirect={false}
        exact
        path="*"
        component={Footer}
      />
      <Alert />
    </AlertContext.Provider>
  );
};

export default AppRouter;
