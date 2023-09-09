import React from 'react'
import './loading.scss'

import ball from '../../images/ball.png';


function Loading() {



    return (
        <div id='loading-container'>
                <div id='loading-dots'>
                    <img id='loading-dot' src={ball} alt='ball'/>
                </div>  
          
                <div id='loading-text'>Loading...</div>            
          
        </div>
    )
}

export default Loading
