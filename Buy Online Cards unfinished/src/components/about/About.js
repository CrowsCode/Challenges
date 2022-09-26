import React from 'react'
import {makeStyles, Container, Paper} from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    container: {
      width: '100%',
      height: '80vh'
    }
  }));

function About() {
    const classes = useStyles();
    return (
     
            <Paper elevation={2}  className={classes.container}>
             
            </Paper>
       
    )
}  

export default About
