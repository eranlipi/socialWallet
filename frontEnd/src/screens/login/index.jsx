import React, { useContext, useEffect } from "react";
import { Grid } from "@material-ui/core";
import LoginBox from "./LoginBox";
import { AlertContext } from "../../Routes";
import { useLocation } from "react-router-dom";

const Login = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const { setAlertMsg, setAlertType, setAlertOpen } = useContext(AlertContext);

  useEffect(() => {
    const code = query.get("code");
    if (code === "2112261") {
      setAlertMsg("Third party authentication is failed");
      setAlertType("error");
      setAlertOpen(true);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid container justifyContent="center" xs={12} md={5}>
        <LoginBox />
      </Grid>
    </Grid>
  );
};

export default Login;
