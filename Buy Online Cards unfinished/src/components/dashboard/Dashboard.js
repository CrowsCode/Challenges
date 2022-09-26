import React from 'react'
import { Redirect } from 'react-router';

import {Grid, Container} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton'

import Fav from './services/Fav'
import TotalSpent from './TotalSpent'
import CurrentOrder from './CurrentOrders_table'
import CardComponent from './Card'


function Home(props) {

    if(props.user === null){ 
        return (<Redirect  to="/Signin" />)
    }else if(props.user !== null){
        return ( 
            <Container maxWidth='xl'>
        
                <Grid  container   spacing={8} >

                        <Grid  item xs={12} container spacing={3} >
                        
                            <Grid item xs={12} sm={12}  md={12}  lg={9} xl={9}>
                                {
                                    props.user === 'notNull' ?
                                    <Skeleton  width="100%" height='100%'   animation="wave">
                                        <CurrentOrder user={props.user}/>
                                    </Skeleton>
                                :
                                    <CurrentOrder user={props.user}/>
                                }    
                            </Grid>
                                    
                            <Grid item xs={12} sm={9}  md={6}  lg={3} xl={3}>
                                {
                                    props.user === 'notNull' ?
                                    <Skeleton  width="100%"  animation="wave">
                                        <TotalSpent  user={props.user}/>
                                    </Skeleton>
                                :
                                    <TotalSpent  user={props.user}/>
                                }
                            </Grid>
                            
                        </Grid>

                

                
                    <Grid item xs={12} container  spacing={3}>
                    
                        <Grid item xs={12} sm={6}  md={6}  lg={3} xl={2}>
                            {
                                props.user === 'notNull' ?
                                <Skeleton  width="100%"  animation="wave">
                                    <CardComponent title='Favorite' description='get more favorites '>
                                        <Fav user={props.user} balanceStuff={props.balanceStuff} />
                                    </CardComponent>
                                </Skeleton>
                            :
                                <CardComponent title='Favorite' description='get more favorites '>
                                    <Fav user={props.user} balanceStuff={props.balanceStuff} />
                                </CardComponent>
                            }
                        </Grid> 

                    </Grid>
                
                </Grid>
        
            </Container>
        
        )
    }
}

export default Home

