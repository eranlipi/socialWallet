import React, { createContext, useState } from "react";
import { Routes } from "react-router-dom";
import RouteWrapper from "./components/common/RouteWrapper";
import Login from "./screens/login";
import Register from "./screens/register";
import BusinessLogin from "./screens/businessLogin";
import BusinessRegister from "./screens/businessRegister";
import Wallet from "./screens/wallet";
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
      <Routes>
        <RouteWrapper protect={true} redirect={false} path="*" component={Header} />
      </Routes>
      <Wrapper>
        <Routes>
          <RouteWrapper path="/signin" component={Login} />
          <RouteWrapper path="/signup" component={Register} />
          <RouteWrapper path="/business/signin" component={BusinessLogin} />
          <RouteWrapper path="/business/signup" component={BusinessRegister} />
          <RouteWrapper path="/google/verify/:token" component={Verify} />
          <RouteWrapper protect={true} path="/cards" component={Cards} />
          <RouteWrapper protect={true} path="/wallet" component={Wallet} />
          <RouteWrapper
            protect={true}
            path="/editProfile"
            component={Account}
          />
          <RouteWrapper protect={true} path="/" component={Home} />
        </Routes>
      </Wrapper>
      <Routes>
        <RouteWrapper protect={true} redirect={false} path="*" component={Footer} />
      </Routes>
      <Alert />
    </AlertContext.Provider>
  );
};

export default AppRouter;
