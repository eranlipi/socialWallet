import React from "react";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { useContext } from "react";
import { AlertContext } from "../../Routes";

function AlertWrapper(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Alert() {
  const { alertMsg, alertType, alertOpen, setAlertOpen } =
    useContext(AlertContext);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  return (
    <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleClose}>
      <AlertWrapper onClose={handleClose} severity={alertType}>
        {alertMsg}
      </AlertWrapper>
    </Snackbar>
  );
}

export default Alert;
