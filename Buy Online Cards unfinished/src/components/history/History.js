import React,{useState, useEffect} from 'react';
import firebase from 'firebase/app'
import { Redirect } from 'react-router';

import {makeStyles, TablePagination, TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Paper} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton'



const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: '75vh',
  },
});

const columns = [
  { id: 'orderID', label: 'Order ID', minWidth: 170 },
  { id: 'serviceName', label: 'Service Name', minWidth: 100 },
  {
    id: 'cost',
    label: 'Cost',
    minWidth: 170,
    align: 'right'
  }
];

function createData(orderID, serviceName, cost) {
  return {orderID, serviceName, cost};
}

export default function History(props) {

  // StickyHeadTable
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // StickyHeadTable


 
  const [rows, set_rows] = useState([])   
  useEffect(() => { 
    function getAccountServiceses(){
      let temp_rows = []
      firebase.firestore().collection('users').doc(props.user.uid).collection('services').orderBy('orderID').get().then( (snapshot) => { // eslint-disable-line no-loop-func
          snapshot.forEach((doc) => { 
            let temp = doc.data();  
            temp_rows.push(createData(temp.orderID, temp.serviceName, temp.cost));
          });//await la naw loop warning ayat boya aw eslint ai sarom danawa
          set_rows(temp_rows)
      }).catch( (error) => {    });
    }
    if(props.user !== null && props.user !== 'notNull'){
      getAccountServiceses()
    }
  }, [])


    
  if(props.user === null){ 
    return (<Redirect  to="/Signin" />)
  }else if(props.user !== null){
    return(
      <React.Fragment>
        {
          props.user === 'notNull' ?
          <Skeleton width='100%' height='75vh' animation="wave"/>
        :
          <Paper className={classes.root}>
            <TableContainer className={classes.container}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number' ? column.format(value) : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
        
            <TablePagination
              rowsPerPageOptions={[10, 20, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
        }
      </React.Fragment>
    )
  }
}