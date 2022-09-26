  
import React,{useEffect, useState} from 'react';
import firebase from 'firebase/app'
import { useHistory } from "react-router-dom";

import {Typography, Paper, Link, makeStyles} from '@material-ui/core';


const useStyles = makeStyles( (theme) => ({
  depositContext: {
    flex: 1,
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
  },
})); 

export default function Deposits(props) {
  const classes = useStyles();
  let history = useHistory();//ama haman ishi 'Link' akat >> history.push('/forgot')

  const [totalWebsiteOrders, set_totalWebsiteOrders] = useState(0)
  const [currentUserOrders, set_currentUserOrders] = useState(0)
  const [totalUserOrders, set_totalUserOrders] = useState(0)
  
  useEffect(() => {
    if(props.user !== 'notNull' && props.user !== null){

      firebase.database().ref(`users/${props.user.uid}`).once('value').then((snap) => {
        let obj = snap.val() 
        //
        set_totalUserOrders(obj.total === undefined ? 0 : obj.total.totalSpent === undefined ? 0 : obj.total.totalSpent)
        // 
        if(obj.orders !== undefined){
          let currentUserOrders_temp = 0
          const array_orders = Object.keys(obj.orders)
          for (let i = 0; i < array_orders.length; i++) {
            currentUserOrders_temp += parseInt(obj.orders[array_orders[i]].cost)
          }
          set_currentUserOrders(currentUserOrders_temp)
        }
        //
      })
      //
      firebase.database().ref(`total`).once('value').then((snap) => {
        let obj = snap.val() || {}
        set_totalWebsiteOrders(obj.totalSpent === undefined ? 0 : obj.totalSpent)
      })
      //
    }
  }, [])
 
  return (
    <Paper className={`${classes.paper} ${classes.fixedHeight}` }>

      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Total Website Orders {totalWebsiteOrders}&nbsp;$
      </Typography>
      <Typography component="p" className={classes.depositContext}>
        Current Orders {currentUserOrders}&nbsp;$
      </Typography>
      <Typography component="p" className={classes.depositContext}>
        Total Orders {totalUserOrders || 0}&nbsp;$
      </Typography>

      <div>
        <Link color="secondary" href="#" onClick={() => {history.push('/Account')}}>Add Balance</Link>
      </div>
      
    </Paper>
  );
}