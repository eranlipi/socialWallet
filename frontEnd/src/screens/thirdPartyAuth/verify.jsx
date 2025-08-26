import { CircularProgress, Typography, makeStyles } from "@material-ui/core";
import React, { useEffect, useContext } from "react";
import api from "../../helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import { AlertContext } from "../../Routes";
import { login } from "../../auth";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100vh",
  },
  typo: {
    paddingLeft: 10,
  },
});

function Verify() {
  const classes = useStyles();
  const { setAlertMsg, setAlertType, setAlertOpen } = useContext(AlertContext);
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    api.auth.thirdParty(token).then((res) => {
      if (res.type === "success") {
        setAlertMsg(res.msg);
        setAlertType("success");
        setAlertOpen(true);
        login(res.data.user);
        if (res.data.register) navigate("/editProfile");
        else navigate("/");
      } else {
        setAlertMsg(res.msg);
        setAlertType("error");
        setAlertOpen(true);
        navigate("/signin");
      }
    });

    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      <CircularProgress />{" "}
      <Typography className={classes.typo} variant="h5" component="h5">
        Verifying...
      </Typography>
    </div>
  );
}

export default Verify;
