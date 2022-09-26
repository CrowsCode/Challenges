import React,{useState, useEffect} from 'react';
import firebase from 'firebase/app'

import {Paper, TableRow, TableHead, TableContainer, TableBody, TableCell, Table, makeStyles } from '@material-ui/core';


const useStyles = makeStyles({
  table: {
    minWidth: 650,
   
  },
  tableSize:{
    maxHeight: 150
  }
});

function createData(orderID, serviceName, cost) {
  return {orderID, serviceName, cost};
}


export default function AcccessibleTable(props) {
  const classes = useStyles();
    
  const [rows, set_rows] = useState([])

  useEffect(() => {
    function get_AllusersInfo(){
      firebase.database().ref(`users/${props.user.uid}/orders`).on('value', (snapshot) => { 
        if(snapshot.exists()){
          let allOrderObject = snapshot.val()
          let keys = Object.keys(allOrderObject)
          let values = Object.values(allOrderObject)
      
          let temp_rows = []
          for (let i = 0; i < keys.length; i++) {
              temp_rows.push(createData(keys[i], values[i].serviceName, values[i].cost));
          }
          set_rows(temp_rows)
        }
      })
    } 
    if(props.user !== 'notNull' && props.user !== null){
      get_AllusersInfo()
    }
}, [])


  return (
    <TableContainer className={classes.tableSize} component={Paper}>
      <Table className={classes.table} aria-label="caption table">
        <caption>A table of current orders</caption>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell >Service Name</TableCell>
            <TableCell >Cost</TableCell> {/*   align="right"  wayan le aka bchna lai rast */}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.orderID}>
              <TableCell component="th" scope="row">
                {row.orderID}
              </TableCell>
              <TableCell >{row.serviceName}</TableCell>
              <TableCell >{row.cost}&nbsp;$</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}