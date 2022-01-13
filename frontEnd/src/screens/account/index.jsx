import React, { useEffect, useContext, useState } from 'react';
import { Grid } from '@material-ui/core';
import EditProfile from './EditProfile';
import api from '../../helpers/api';
import { AlertContext } from "../../Routes";

const Account = () => {
    const { setAlertMsg, setAlertType, setAlertOpen } = useContext(AlertContext);
    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        jobTitle: "",
        linkedinURL: "",
        facebookURL: "",
        twitterURL: "",
        personalWebsiteURL: ""
    });

    useEffect(() => {
        async function getProfile() {
            const response = await api.auth.getProfile();
            if (response.type === 'error') {
                setAlertMsg(response.msg);
                setAlertType("error");
                setAlertOpen(true);
            } else {
                setProfile(response.data);
                console.log(profile);
            }
        }
        getProfile();
    }, [])

    return (
        <Grid
            container
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
        >
            <Grid container item justifyContent="center" xs={12}>
                <EditProfile profile={profile} />
            </Grid>
        </Grid>
    )
};

export default Account;