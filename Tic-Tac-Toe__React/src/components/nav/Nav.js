import React,{useState, useEffect} from 'react'
import {Link} from 'react-router-dom'

import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretSquareDown, faBars } from '@fortawesome/free-solid-svg-icons';

import profileFallBackPhoto from '../../images/default_profile_photo.png';
import logo from '../../images/logo-background.png';

import './nav.scss'

function Nav(props) {

    const [userInfoObject, set_userInfoObject] = useState(null)
    const user = props.user

    useEffect(() => {
        async function get_userInfo(){
            firebase.database().ref(`users/${props.user.uid}/userInfo`).on('value', (snapshot) => { //live update
                let temp_userInfoObject = snapshot.val() 
                set_userInfoObject(temp_userInfoObject)
                } ) 
        }
        
        if(props.user !== null && props.user !== 'notNull'){
            document.getElementById('logout').addEventListener( 'click', logout)
            document.getElementById('check-button').checked = false;

            get_userInfo()
        }
        
     }, [props.user])

    function logout(){
        firebase.auth().signOut().then( ()=> {     } );
    }
 
    function closeMobileMenu(){
        document.getElementById('check-button').checked = false;
    }

    function switchDarkMode(){

    }


 
    return (
        <nav>

            <div id='left-nav' >
                <Link to='/'>
                    <img id='left-nav-logo' onClick={closeMobileMenu} src={logo} alt='Logo'/>
                </Link>
            </div>
           
 

            <input id='check-button' type='checkBox'/>  {/*display none akre u qat visiable nakreto */}
            <label id='check-label' htmlFor='check-button'>  {/*kate visiable abe ka shashaka bchuk buyo*/}
                <FontAwesomeIcon icon={faBars} />  
            </label>
           
           
            <label id='mobile-menu' htmlFor='check-button'>   {/*  element'akani xwaro ba haman shewai mobile-menu ka htmlFor bo da na nren ka aman nakren ba label */}
                {user !== null ? (       <Link to='/about'   className='mobile-menu-element' onClick={closeMobileMenu}>About</Link>   )  : '' }
                {user !== null ? (       <Link to='/leaderboard'   className='mobile-menu-element' onClick={closeMobileMenu}>LeaderBoard</Link>   )  : '' }
                {user !== null ? (       <Link to='/history'   className='mobile-menu-element' onClick={closeMobileMenu}>History</Link>   )  : '' }
                {user !== null ? (       <Link to='/play'  className='mobile-menu-element' onClick={closeMobileMenu}>Play</Link>   )  : '' }
                {user !== null ? (       <Link to='/profile' className='mobile-menu-element' onClick={closeMobileMenu}>Profile</Link>   )  : '' }
                {user !== null ? (      <Link to='/settings' className='mobile-menu-element' onClick={closeMobileMenu}>Settings</Link>    )  : '' }
                {user !== null ? (      <div id='logout' className='mobile-menu-element'>Logout</div>      )  : '' }     
            
                {user === null ? (  <Link to='/about'   className='mobile-menu-element' onClick={closeMobileMenu}>About</Link>  )  : '' }
                {user === null ? (  <Link to='/leaderBoard'   className='mobile-menu-element' onClick={closeMobileMenu}>LeaderBoard</Link>  )  : '' }
                {user === null ? (  <Link to='/login' className='mobile-menu-element' onClick={closeMobileMenu}> Login</Link>   )  : '' }
                {user === null ? (  <Link to='/signUp' className='mobile-menu-element' onClick={closeMobileMenu}>Sign Up</Link>  )  : '' }    
            </label>
           
            <div id='right-nav'>

                <Link to='/about'   className='nav-element'  >About </Link>  
                <Link to='/leaderBoard' className='nav-element' onClick={closeMobileMenu}>LeaderBoard</Link>
                {user !== null ? (       <Link to='/history' className='nav-element' onClick={closeMobileMenu}>History</Link>   )  : '' }
                {user !== null ? (       <Link to='/play'  className='nav-element'  >Play</Link>   )  : '' }
                
                <div id='right-nav-account'>
                    {user === null ? (  <Link to='/Login' className='nav-element'  > Login </Link>   )  : '' }
                    {user === null ? (  <Link to='/SignUp' className='nav-element'  >Sign Up</Link>  )  : '' }
                    
                    {user !== null ? (
                    <Link to='/Profile'  
                        id='right-nav-profile'>                            
                            <img  src={props.user.photoURL}  alt='profile' onError={(e)=>{e.target.onerror = null; e.target.src=profileFallBackPhoto }} />
                            <div id='right-nav-profile-name-level'>
                                <span id='right-nav-profile-name'>{userInfoObject === null ? '' : userInfoObject.name}</span>
                                <div id='right-nav-profile-level-stuff'>
                                    <span id='right-nav-profile-level'>level: {userInfoObject === null ? '..' : userInfoObject.level}</span>
                                    <progress id="right-nav-profile-level-progress" value={userInfoObject === null ? '100' : userInfoObject.xp} max={userInfoObject === null ? '100' : userInfoObject.xpNeededToLevelUp}/>    
                                </div> 
                            </div>
                    </Link>)  : '' }
                    {user !== null ? (
                        <div  id='right-nav-settings' >
                            <Link to='/Settings' id='right-nav-settings-icon' ><FontAwesomeIcon icon={faCaretSquareDown} /> </Link>
                       
                            <div id="right-nav-dropdown-elements" >
                                <button id='right-nav-dropdown-element-logout' onClick={logout}>logout</button>
                                <button id='right-nav-dropdown-element-darkMode' onClick={switchDarkMode}>
                                    Dark Mode
                                    <div id='right-nav-dropdown-element-darkMode-hint'>Coming Soon...</div>
                                </button>
                            </div>
                        </div>      )  : '' }
                </div>
               
            </div>

        </nav>
    )
}

export default Nav


/*


Run the following command to install the base packages:

npm i -S @fortawesome/fontawesome-svg-core @fortawesome/react-fontawesome

These will install the solid icons:

# solid icons
npm i -S @fortawesome/free-solid-svg-icons



*/