import React, { useState, useContext, useEffect } from 'react';
import { Box, Grid, Button, Modal, makeStyles } from '@material-ui/core';
import MyTextField from '../../components/common/MyTextField';
import MuiPhoneNumber from 'mui-phone-number';
import { useFormik } from 'formik';
import avatar from "../../assets/default-avatar.svg";
import * as Yup from 'yup';
import MyAvatarUploader from '../../components/common/MyAvatarUploader';
import LocalButton from "../../components/common/LocalButton";
import MyImage from "./../../components/common/MyImage";
import api from '../../helpers/api';
import { AlertContext } from "../../Routes";
import { getImageBlob } from '../../helpers/fileUpload';
import { getUser } from "../../auth";


const useStyles = makeStyles({
    avatar: {
        cursor: "pointer",
        position: "relative",
        left: 30
    },
    avatarButton: {
        width: 20,
        height: 20,
        position: "relative",
        top: 110,
        right: 20

    },
    button: {
        width: '100%',
        marginTop: "1rem",
        marginBottom: "0.5rem"
    },
    editProfileBox: {
        width: "100%",
        padding: 10,
        justifyContent: "center",
        display: "block"
    },
    profilePictureEditor: {
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontWeight: 'bold',
        fontSize: '2rem',
        marginBottom: '1rem',
    },
    titleContainer: {
        justifyContent: "center",
        backgroundColor: "blue",
        flexDirection: "row",
    }
});

const validationSchema = Yup.object().shape({
    firstName: Yup.string()
        .trim()
        .matches(/^[a-z A-Z]+$/, "english character (a-z, A-Z)")
        .required("This field is required..."),
    lastName: Yup.string()
        .trim()
        .matches(/^[a-z A-Z]+$/, "english character (a-z, A-Z)")
        .required("This field is required..."),
    phoneNumber: Yup.string()
        .trim()
        .matches(/^[+0-9]+$/, "phone number (Characters allowed: 0-9, +)"),
    jobTitle: Yup.string()
        .trim()
        .matches(/^[a-z A-Z]+$/, "english character (a-z, A-Z)"),
    linkedinURL: Yup.string()
        .trim(),
    facebookURL: Yup.string()
        .trim(),
    twitterURL: Yup.string()
        .trim(),
    personalWebsiteURL: Yup.string()
        .trim(),

});


const EditProfile = ({ profile }) => {
    const [user, setUser] = useState(getUser().user);
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [profilePictureUploading, setProfilePictureUploading] = useState(false);
    const { setAlertMsg, setAlertType, setAlertOpen } = useContext(AlertContext);
    const formik = useFormik({
        initialValues: {
            firstName: profile.firstName,
            lastName: profile.lastName,
            phoneNumber: profile.phoneNumber ? profile.phoneNumber : "",
            jobTitle: profile.jobTitle ? profile.jobTitle : "",
            linkedinURL: profile.linkedinURL ? profile.linkedinURL : "",
            facebookURL: profile.facebookURL ? profile.facebookURL : "",
            twitterURL: profile.twitterURL ? profile.twitterURL : "",
            personalWebsiteURL: profile.personalWebsiteURL ? profile.personalWebsiteURL : ""
        },
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            const response = await api.auth.editProfile({
                firstName: values.firstName,
                lastName: values.lastName,
                phoneNumber: values.phoneNumber,
                jobTitle: values.jobTitle,
                linkedinURL: values.linkedinURL,
                facebookURL: values.facebookURL,
                twitterURL: values.twitterURL,
                personalWebsiteURL: values.personalWebsiteURL
            });
            if (response.type === "success") {
                setAlertMsg(response.msg);
                setAlertType("success");
                setAlertOpen(true);
            } else {
                setAlertMsg(response.msg);
                setAlertType("error");
                setAlertOpen(true);
            }
            setLoading(false);
        },
    });

    const [profilePictureOpen, setProfilePictureOpen] = useState(false);
    const handleUpload = async (file) => {
        const blobResponse = await getImageBlob(file);
        if (blobResponse.success) {
            const formData = new FormData();
            formData.append("avatar", blobResponse.data);
            setProfilePictureUploading(true);
            const uploadResponse = await api.auth.uploadProfilePicture(formData);
            if (uploadResponse.type === "success") {
                window.location.reload(false);
                setAlertMsg(uploadResponse.msg);
                setAlertType("success");
                setAlertOpen(true);
                setProfilePictureOpen(false);
            } else {
                setAlertMsg(uploadResponse.msg);
                setAlertType("error");
                setAlertOpen(true);
            }
            setProfilePictureUploading(false);
        } else {
            setAlertMsg("Error preparing image upload");
            setAlertType("error");
            setAlertOpen(true);
        }
    };


    return (
        <div className={classes.editProfileBox}>

            <Grid container justifyContent='center'>
                <Grid container xs={12} justifyContent="center">
                    <div className={classes.title}>Edit Profile</div>
                </Grid>
                <Grid container xs={12} justifyContent="center">
                    <Modal

                        open={profilePictureOpen}
                        className={classes.profilePictureEditor}
                    >
                        <Box style={{ position: "absolute", top: "20%", left: "40%" }}>
                            <MyAvatarUploader
                                onClose={() => setProfilePictureOpen(false)}
                                onUpload={(file) => handleUpload(file)}
                                updating={profilePictureUploading}
                            />
                        </Box>
                    </Modal>
                    <MyImage
                        src={api.auth.loadProfileImage(user.userID)}
                        width={120}
                        height={120}
                        className={classes.avatar}
                        onClick={() => setProfilePictureOpen(true)}
                    />
                    <Button
                        type='submit'
                        className={classes.avatarButton}
                        variant="contained"
                        color="primary"
                        onClick={() => setProfilePictureOpen(true)}
                    >
                        Change
                    </Button>
                </Grid>
                <Grid item xs={12} md={5} justifyContent="center">
                    <form onSubmit={formik.handleSubmit}>
                        <MyTextField
                            id='firstName'
                            name='firstName'
                            label="First Name"
                            type="text"
                            value={formik.values.firstName}
                            helperText={formik.touched.firstName && formik.errors.firstName}
                            onChange={formik.handleChange}
                            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                        />
                        <MyTextField
                            id='lastName'
                            name='lastName'
                            label="Last Name"
                            type="text"
                            value={formik.values.lastName}
                            helperText={formik.touched.lastName && formik.errors.lastName}
                            onChange={formik.handleChange}
                            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                        />
                        <MuiPhoneNumber
                            defaultCountry={'us'}
                            fullWidth
                            id='phoneNumber'
                            name='phoneNumber'
                            label="Phone Number"
                            variant="outlined"
                            value={formik.values.phoneNumber}
                            onChange={formik.handleChange("phoneNumber")}
                        />
                        <MyTextField
                            id='jobTitle'
                            name='jobTitle'
                            label="Job Title"
                            type="text"
                            value={formik.values.jobTitle}
                            helperText={formik.touched.jobTitle && formik.errors.jobTitle}
                            onChange={formik.handleChange}
                            error={formik.touched.jobTitle && Boolean(formik.errors.jobTitle)}
                        />
                        <MyTextField
                            id='linkedinURL'
                            name='linkedinURL'
                            label="Linkedin URL"
                            type="text"
                            value={formik.values.linkedinURL}
                            helperText={formik.touched.linkedinURL && formik.errors.linkedinURL}
                            onChange={formik.handleChange}
                            error={formik.touched.linkedinURL && Boolean(formik.errors.linkedinURL)}
                        />
                        <MyTextField
                            id='facebookURL'
                            name='facebookURL'
                            label="Facebook URL"
                            type="text"
                            value={formik.values.facebookURL}
                            helperText={formik.touched.facebookURL && formik.errors.facebookURL}
                            onChange={formik.handleChange}
                            error={formik.touched.facebookURL && Boolean(formik.errors.facebookURL)}
                        />
                        <MyTextField
                            id='twitterURL'
                            name='twitterURL'
                            label="Twitter URL"
                            type="text"
                            value={formik.values.twitterURL}
                            helperText={formik.touched.twitterURL && formik.errors.twitterURL}
                            onChange={formik.handleChange}
                            error={formik.touched.twitterURL && Boolean(formik.errors.twitterURL)}
                        />
                        <MyTextField
                            id='personalWebsiteURL'
                            name='personalWebsiteURL'
                            label="Personal Website URL"
                            type="text"
                            value={formik.values.personalWebsiteURL}
                            helperText={formik.touched.personalWebsiteURL && formik.errors.personalWebsiteURL}
                            onChange={formik.handleChange}
                            error={formik.touched.personalWebsiteURL && Boolean(formik.errors.personalWebsiteURL)}
                        />

                        <LocalButton
                            type="submit"
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            loading={loading}
                        >
                            Update
                        </LocalButton>
                    </form>
                </Grid>
            </Grid>
        </div>
    );
};

export default EditProfile;