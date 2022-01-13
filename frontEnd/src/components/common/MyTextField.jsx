import React from 'react';
import { TextField, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    textField: {
        display: "block",
        marginTop: 18,
        marginBottom: 18
    }
});

const MyTextField = ({ id, name, label, value, type, error, helperText, onChange = () => {}}) => {
    const classes = useStyles();

    return(
        <TextField  
            id = {id}
            name = {name}
            label= {label} 
            value = {value}
            error = {error}
            type = {type}
            helperText = {helperText}
            onChange = {onChange}
            variant="outlined"
            className = {classes.textField}
            fullWidth
            
        />
    )
};

export default MyTextField;