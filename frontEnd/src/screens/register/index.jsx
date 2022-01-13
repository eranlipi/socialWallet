import React, { useContext, useEffect } from "react";
import { Grid } from "@material-ui/core";
import RegisterBox from "./RegisterBox";
import { AlertContext } from "../../Routes";
import { useLocation } from "react-router-dom";

const Register = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const { setAlertMsg, setAlertType, setAlertOpen } = useContext(AlertContext);

  useEffect(() => {
    const code = query.get("code");
    if (code === "2112262") {
      setAlertMsg("Your authorized account email is not yet verified");
      setAlertType("error");
      setAlertOpen(true);
    } else if (code === "2112263") {
      setAlertMsg(
        "You already registered as a local user, try to login using email and password"
      );
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
      <Grid container item justifyContent="center" xs={12} md={5}>
        <RegisterBox />
      </Grid>
    </Grid>
  );
};

export default Register;
