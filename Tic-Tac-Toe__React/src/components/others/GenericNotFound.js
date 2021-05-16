import React from 'react'
import './genericNotFound.scss'


function GenericNotFound(props) {



    return (
        <div id='genericNotFound-container'>
        
            <div id='error-stuff'>
                <div className='error-from-div'>
                    <div className='error-from-text'>From: </div>
                    <div className='error-from'>{props.location.state === undefined ? '' : props.location.state.from === undefined ? 'Unknown' : props.location.state.from }</div>
                </div>
                <div className='error-name-div'>
                    <div className='error-name-text'>User's Name: </div>
                    <div className='error-name'>{props.location.state === undefined ? '' : props.location.state.name === undefined ? 'Unknown' : props.location.state.name }</div>
                </div>
                <div className='error-message-div'>
                    <div className='error-message-text'>Message: </div>
                    <div className='error-message'>{props.location.state === undefined ? '' : props.location.state.error === undefined ? 'Unknown' : props.location.state.error }</div>
                </div>
            </div>
        </div>
    )
}

export default GenericNotFound


/*
React-Router: No Not Found Route?  >>>  https://stackoverflow.com/questions/32128978/react-router-no-not-found-route
*/