import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    wdith: "100%",
    minHeight: "100vh",
  },
}));

function Wrapper({ children }) {
  const classes = useStyles();

  return <section className={classes.root}>{children}</section>;
}

export default Wrapper;
