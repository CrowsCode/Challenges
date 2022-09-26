import React from 'react'
import Skeleton from '@material-ui/lab/Skeleton'
import {Grid} from '@material-ui/core'

function Loading() {
    return (
        <Grid  container  direction="row"  justify="center"  alignItems="center">
            <Skeleton width="50%" height='75vh'/>
        </Grid>
    )
}

export default Loading
