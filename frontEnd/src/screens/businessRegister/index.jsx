import React from "react";
import { Grid } from "@material-ui/core";
import BusinessRegisterBox from "./BusinessRegisterBox";

const BusinessRegister = () => {
  return (
    <Grid container alignItems="center" justifyContent="center" style={{ minHeight: "100vh" }}>
      <Grid container item justifyContent="center" xs={12} md={5}>
        <BusinessRegisterBox />
      </Grid>
    </Grid>
  );
};

export default BusinessRegister;
