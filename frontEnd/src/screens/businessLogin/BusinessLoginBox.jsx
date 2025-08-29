import React, { useContext, useState } from "react";
import { Grid, makeStyles } from "@material-ui/core";
import { useFormik } from "formik";
import * as Yup from "yup";
import MyTextField from "../../components/common/MyTextField";
import LocalButton from "../../components/common/LocalButton";
import api from "../../helpers/api";
import { AlertContext } from "../../Routes";
import { useNavigate } from "react-router-dom";
import { login } from "../../auth";

const useStyles = makeStyles({
  box: {
    width: "100%",
    padding: "3rem",
    borderRadius: 20,
    boxShadow: "0 0 10px grey",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
  },
  button: {
    width: "100%",
    marginTop: "1rem",
    marginBottom: "0.5rem",
  },
});

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email should be a valid email")
    .required("This field is required"),
  password: Yup.string().required("This field is required"),
});

const BusinessLoginBox = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { setAlertMsg, setAlertType, setAlertOpen } = useContext(AlertContext);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      api.business.login(values).then((res) => {
        if (res.type === "success") {
          setAlertMsg(res.msg);
          setAlertType("success");
          setAlertOpen(true);
          login(res.data);
          navigate("/wallet");
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
    <div className={classes.box}>
      <div className={classes.title}>Business Sign in</div>
      <Grid container justifyContent="center">
        <Grid item md={8} xs={12}>
          <form onSubmit={formik.handleSubmit}>
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
            <LocalButton
              type="submit"
              className={classes.button}
              variant="contained"
              color="primary"
              loading={loading}
            >
              Sign in
            </LocalButton>
          </form>
        </Grid>
      </Grid>
    </div>
  );
};

export default BusinessLoginBox;
