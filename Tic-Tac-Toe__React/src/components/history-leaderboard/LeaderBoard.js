import React,{useState, useEffect} from 'react'
import firebase from 'firebase/app'
import 'firebase/database';
import {Link} from 'react-router-dom'

import './LeaderBoard.scss'
import Loading from '../others/Loading'

import profileFallBackPhoto from '../../images/default_profile_photo.png';

let intervalInstance
function LeaderBaord() {
    const [arrayOf_UIDContents, set_arrayOf_UIDContents] = useState('loading')


        useEffect( () =>{
            
            function get_AllusersInfo(){
                firebase.database().ref(`users`).limitToLast(50).once('value').then( (snapshot) => {
                let allUserObject = snapshot.val()
                let keys = Object.keys(allUserObject)
                let values = Object.values(allUserObject)
                let temp;
         
                for (let i = 0; i < values.length; i++) {
                    for (let j = 0; j < values.length; j++) {
                        console.log(values[i].userInfo)
                        if(values[i].userInfo !== undefined && values[j].userInfo !== undefined && values[j].userInfo && values[i].userInfo.level > values[j].userInfo.level){   
                            //console.log(temp)
                            temp = values[j]
                            values[j] = values[i]
                            values[i] = temp
                           
                        }
                    }
                }
             
                set_arrayOf_UIDContents(values || {})
                } )
            } 

            function interval(){
           
                intervalInstance = setInterval(()=>{ //console.log('leaderboard updated')
                    get_AllusersInfo()  
                }, 10000)
            }
     get_AllusersInfo()  
            interval()

            return () =>  {    clearInterval(intervalInstance);    }
        },[])
    

        
    if(arrayOf_UIDContents === 'loading'){
        return (<Loading  />)
    }else{
        return(
            <div id='leaderBaord-container'>

                <div id='header-container'>
                    <div className='header-text'>Name</div>
                    <div className='header-text'>Location</div>
                    <div className='header-text'>Level</div>
                </div>

                { 
                    arrayOf_UIDContents.map( (uid_Content) => {
                        return(
                        uid_Content.userInfo === undefined? "" :
                        (
                            <div className='userInfo-container' key={uid_Content.userInfo.name}>
                                <Link className='userInfo-photo-and-name' to={`/Profile/${uid_Content.userInfo.name}`}>
                                    <img className='userInfo-photo' id='img' src={uid_Content.userInfo.photoURL} alt='profile' 
                                        onError={(e)=>{e.target.onerror = null; e.target.src=profileFallBackPhoto }} />
                                    <div className='userInfo-name'>{uid_Content.userInfo.name}</div>
                                </Link>
                                <div className='userInfo-location'>
                                    {uid_Content.userInfo.location}
                                </div>
                                <div className='userInfo-level'>
                                    {uid_Content.userInfo.level}
                                </div>
                            </div>
                        ))
                    }) 
                } 
                  
            </div>
        )
    } 
} 

export default LeaderBaord
