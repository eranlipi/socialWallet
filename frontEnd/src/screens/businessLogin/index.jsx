import React from "react";
import { Grid } from "@material-ui/core";
import BusinessLoginBox from "./BusinessLoginBox";

const BusinessLogin = () => {
  return (
    <Grid container alignItems="center" justifyContent="center" style={{ minHeight: "100vh" }}>
      <Grid container item justifyContent="center" xs={12} md={5}>
        <BusinessLoginBox />
      </Grid>
    </Grid>
  );
};

export default BusinessLogin;
