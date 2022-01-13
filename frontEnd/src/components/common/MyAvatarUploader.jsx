import React, { useState } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import Avatar from 'react-avatar-edit';
import { mergeClasses } from '@material-ui/styles';
import LocalButton from './LocalButton';

const useStyles = makeStyles({
    buttonsContainer: {
        marginTop: 20,
        justifyContent: "space-around",
        display: "flex",
    },
});

const MyAvatarUploader = ({ onClose, onUpload, updating }) => {
    const classes = useStyles();
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState();

    const handleBeforeFileLoad = elem => {
        if (elem.target.files[0].size > 10901904) {
            alert("File is too big!");
            elem.target.value = "";
        };
    }

    return (
        <>
            <Avatar
                width={300}
                height={300}
                onCrop={preview => setPreview(preview)}
                onBeforeFileLoad={handleBeforeFileLoad}
                labelStyle={{ color: "white" }}
            />
            <div className={classes.buttonsContainer}>
                <LocalButton
                    type='submit'
                    variant="contained"
                    color="primary"
                    loading={false}
                    onClick={onClose}
                >
                    Close
                </LocalButton>
                <LocalButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    loading={updating}
                    onClick={() => onUpload(preview)}
                >
                    Confirm
                </LocalButton>
            </div>
        </>
    );
};

export default MyAvatarUploader;
