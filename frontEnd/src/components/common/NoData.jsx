import React from "react";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  paragraph: {
    textAlign: "center",
    fontSize: "1rem",
  },
  icon: {
    fontSize: "3rem",
  },
}));

function NoData() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ErrorOutlineIcon className={classes.icon} fontSize="large" />
      <p className={classes.paragraph}>Data not found</p>
    </div>
  );
}

export default NoData;
