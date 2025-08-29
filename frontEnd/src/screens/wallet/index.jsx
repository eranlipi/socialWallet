import React from "react";
import { Grid } from "@material-ui/core";
import WalletManager from "../../components/wallet/WalletManager";

const Wallet = () => {
  return (
    <Grid container justifyContent="center" style={{ paddingTop: "2rem" }}>
      <Grid item xs={12} md={6}>
        <WalletManager />
      </Grid>
    </Grid>
  );
};

export default Wallet;
