import { CircularProgress, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    wdith: "100%",
    minHeight: "100vh",
  },
}));

function Loading({ loading, children }) {
  const classes = useStyles();

  return loading ? (
    <div className={classes.root}>
      <CircularProgress size={24} />
    </div>
  ) : (
    <>{children}</>
  );
}

export default Loading;
