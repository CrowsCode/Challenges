import React,{useContext, useState} from 'react';
import firebase from 'firebase/app'
import 'firebase/auth';

import {Grid, Container, Typography, TextField, Button, } from '@material-ui/core';
import { context} from  '../../../App';


const serviceCost = 0.01//0.1$

function Fav(props) {
    const[cost, set_cost] = useState(0)
    const[numberOfService, set_numberOfService] = useState(0)
    const[groupID, set_groupID] = useState(0)

    const context_info = useContext(context)


    function handleChange_costAndService(number, type){
        if(type === 'service'){
            let newCost = (number * serviceCost)
            set_numberOfService(number)
            set_cost(parseInt(newCost))
        }else if(type === 'cost'){
            let new_numberOfService =   (number / serviceCost)
            set_cost(parseInt(number))
            set_numberOfService(new_numberOfService)
        }
    }

    function submitRequestForService(e){
        e.preventDefault()
        if(props.balanceStuff.balance - cost < 0){
            context_info.setSnackbar({message: `Insufficient balance, need ${Math.abs(props.balanceStuff.balance-cost)}$ more`, variant: 'error'})
            return
        }
        firebase.database().ref(`services/main/latest_orderID`).once('value', (snapshot) => { 
            let newBalance = props.balanceStuff.balance - cost
            props.balanceStuff.set_balance(newBalance)
            firebase.database().ref(`users/${props.user.uid}`).update({balance: newBalance})
            
            let latest_orderID = snapshot.val() || 0
            let updates = {}
            latest_orderID += 1 
            updates[`${latest_orderID}/orderID`] = latest_orderID
            updates[`${latest_orderID}/serviceName`] = 'Favorite'
            updates[`${latest_orderID}/info/groupID`] = groupID
            updates[`${latest_orderID}/numberOfService`] = numberOfService
            updates[`${latest_orderID}/cost`] = cost
            updates[`${latest_orderID}/uid`] = props.user.uid
            firebase.database().ref(`users/${props.user.uid}/orders/`).update(updates)// latestOrderNumber tya nabe

            updates[`main/latest_orderID`] = latest_orderID // updates latest_orderID on database by adding 1
            firebase.database().ref(`services/`).update(updates)    
        })   
    }




    return (
        <form  onSubmit={(e) =>{   submitRequestForService(e)}} id="form-settings">
            <Container maxWidth="sm">
                <Grid container spacing = {4}>
                    <Grid item xs={12} container direction="row" justify="space-between" alignItems="center">
                        <Grid  item xs={5}>
                            <Typography>Favorite</Typography>
                        </Grid>
                        <Grid  item xs={5}  container direction="column" justify="space-between" alignItems="flex-start">
                            <Grid>
                                <Typography>Balance: {props.balanceStuff.balance}&nbsp;$</Typography>
                            </Grid>
                            <Grid>
                                <Typography>Cost: 1 favorite for {serviceCost}&nbsp;$</Typography>
                            </Grid>   
                        </Grid>
                    </Grid>

                    <Grid item xs={12} spacing={1} container direction="row" justify="space-between" alignItems="center">
                        <Grid item xs={5}>
                            <TextField fullWidth  required id="favorites-required"  label="Number of Favorites" variant="outlined"
                            value={numberOfService || 0} onChange={(e) => {  handleChange_costAndService(e.target.value, 'service') }}
                            />
                        </Grid>
                        
                        <Grid item xs={5}>
                            <TextField  fullWidth required id="cost-required"  label="Cost" variant="outlined"
                            value={cost || 0} onChange={(e) => { handleChange_costAndService(e.target.value, 'cost') }}
                            />
                        </Grid>                 
                    </Grid>
                

                    <Grid item xs={12}>
                    <TextField  fullWidth  required id="requirements-required"  label="Group ID" variant="outlined"
                            value={groupID || 0} onChange={(e) => { set_groupID(e.target.value, 'cost') }} 
                            />
                    </Grid>
                    
                    <Grid item xs={12 }>
                        <Button type="submit" fullWidth variant="contained" color="secondary">Buy</Button>
                    </Grid>
                    
                </Grid>
            </Container>
        </form>
    )
}
export default Fav