import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { makeStyles, Grid } from "@material-ui/core";
import { useFormik } from "formik";
import * as Yup from "yup";
import MyTextField from "../../components/common/MyTextField";
import gmailLogo from "./../../assets/gmail-logo.svg";
import api, { urls } from "../../helpers/api";
import { AlertContext } from "../../Routes";
import { login } from "../../auth";
import LocalButton from "../../components/common/LocalButton";

const useStyles = makeStyles({
  accountContainer: {
    marginTop: "1rem",
  },
  accountText: {
    color: "grey",
  },
  button: {
    width: "100%",
    marginTop: "1rem",
    marginBottom: "0.5rem",
  },
  checkbox: {
    marginLeft: 0,
    padding: 0,
  },
  forgotPassword: {
    color: "grey",
    marginBottom: "1rem",
  },
  googleSignupText: {
    color: "#0C66C2",
    fontWeight: "bold",
  },
  gmailLogo: {
    width: "2rem",
    height: "2rem",
  },
  registerBox: {
    width: "100%",
    padding: "3rem",
    borderRadius: 20,
    boxShadow: "0 0 10px grey",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
  },
});

const validationSchema = Yup.object({
  firstName: Yup.string().required("This field is required"),
  lastName: Yup.string().required("This field is required"),
  email: Yup.string()
    .email("Email should be a valid email")
    .required("This field is required"),
  password: Yup.string()
    .min(6, "Password must contain more than 6 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
      "Password must contain minimum six characters, at least one letter, one number and one special character"
    )
    .required("Required field"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password must be the same")
    .required("This field is required"),
});

const RegisterBox = () => {
  const classes = useStyles();
  const { setAlertMsg, setAlertType, setAlertOpen } = useContext(AlertContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      const data = { ...values };
      delete data["confirmPassword"];

      api.auth.register(data).then((res) => {
        if (res.type === "success") {
          setAlertMsg(res.msg);
          setAlertType("success");
          setAlertOpen(true);
          login(res.data);
          navigate("/editProfile");
        } else {
          setAlertMsg(res.msg);
          setAlertType("error");
          setAlertOpen(true);
        }
        setLoading(false);
      });
    },
  });

  return (
    <div className={classes.registerBox}>
      <div className={classes.title}>Sign up</div>
      <Grid container justifyContent="center">
        <Grid item md={8}>
          <form onSubmit={formik.handleSubmit}>
            <MyTextField
              id="firstName"
              name="firstName"
              label="First Name"
              type="text"
              value={formik.values.firstName}
              helperText={formik.touched.firstName && formik.errors.firstName}
              onChange={formik.handleChange}
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
            />
            <MyTextField
              id="lastName"
              name="lastName"
              label="Last Name"
              type="text"
              value={formik.values.lastName}
              helperText={formik.touched.lastName && formik.errors.lastName}
              onChange={formik.handleChange}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            />
            <MyTextField
              id="email"
              name="email"
              label="Email"
              type="email"
              value={formik.values.email}
              helperText={formik.touched.email && formik.errors.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
            />
            <MyTextField
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              helperText={formik.touched.password && formik.errors.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
            />
            <MyTextField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formik.values.confirmPassword}
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              onChange={formik.handleChange}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
            />

            <LocalButton
              type="submit"
              className={classes.button}
              variant="contained"
              color="primary"
              loading={loading}
            >
              Sign up
            </LocalButton>
          </form>

          <Grid container alignItems="center" justifyContent="center">
            <Grid item xs={5}>
              <div
                style={{
                  width: "100%",
                  height: "0.1rem",
                  backgroundColor: "#808080",
                  display: "inline-block",
                }}
              />
            </Grid>
            <Grid container item xs={2} justifyContent="center">
              <span>OR</span>
            </Grid>

            <Grid container item xs={5}>
              <div
                style={{
                  width: "100%",
                  height: "0.1rem",
                  backgroundColor: "#808080",
                  display: "inline-block",
                }}
              />
            </Grid>
            <Grid container alignItems="center">
              <Grid container item xs={3} justifyContent="center">
                <Link
                  onClick={() => {
                    window.location = urls.auth.google;
                  }}
                  to="#"
                >
                  <img
                    src={gmailLogo}
                    alt="Gmail Logo"
                    className={classes.gmailLogo}
                  />
                </Link>
              </Grid>
              <Grid container item xs={9} justifyContent="flex-start">
                <Link
                  onClick={() => {
                    window.location = urls.auth.google;
                  }}
                  to="#"
                >
                  <span className={classes.googleSignupText}>
                    Sign up with Google
                  </span>
                </Link>
              </Grid>
            </Grid>
            <Grid container className={classes.accountContainer}>
              <Grid container item sm={8} justifyContent="center">
                <span className={classes.accountText}>
                  Already have an account?
                </span>
              </Grid>
              <Grid container item sm={4} justifyContent="flex-start">
                <Link to="/signin">Sign in</Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default RegisterBox;
