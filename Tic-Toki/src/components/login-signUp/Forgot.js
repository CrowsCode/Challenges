import React,{useState} from 'react'
import firebase from 'firebase/app'
import 'firebase/auth';

import {Link} from 'react-router-dom'
import { Redirect } from 'react-router';
import Loading from '../others/Loading'
import './form.scss'

function Forgot(props) {
 
    const [email, setEmail] = useState('')
    const [isBackToLogin, set_isBackToLogin] = useState(false)

    function showStateOnDom(id, display, innerHTML, style){
        document.getElementById(id).style.display = display
        document.getElementById(id).innerHTML = innerHTML
        document.getElementById(id).style.color = style
    }
         
  
    function forgotPassword(e){
        e.preventDefault()

        firebase.auth().sendPasswordResetEmail(email).then( () => {
            showStateOnDom('input-result', 'block', `Succesfuly sent password reset email to ${email}`, 'green' )
            setEmail('') //succesful

            setTimeout( () => {
                //document.getElementById('input-result').style.display = 'none';
                set_isBackToLogin(true)
            }, 3000);
           
        }).catch( (error) => {
            showStateOnDom('input-result', 'block', `Succesfuly sent password reset email to ${email}`, 'red' )//sendPasswordResetEmail failed
        });
    }
         
 
    if(isBackToLogin === true){
        set_isBackToLogin(false)
        return (<Redirect  to="/login" />)
    }else if(props.user === 'notNull'){ 
        return (<Loading  />)
    }else if(props.user !== null){ 
        return (<Redirect  to="/" />)
    }else if(props.user === null){
        return (
            <form onSubmit={ (e) => forgotPassword(e)} id="form">
                <div id="inputs-container">

                    <div id='forgot-header'>Enter your account's email</div>

                    <div className="input-div">
                        <input className="form-input" id="email" value={email} onChange={ (e) => setEmail(e.target.value) } type="email" placeholder=" " required />
                        <div className="form-text">Email</div>
                    </div>

                    <div id='input-result'></div>
                    
                </div>
        


                <div id='buttons-container'>
                    <div id='links'>
                        <Link to='/login' className='form-submit-link' >
                            Login
                        </Link>
                        <Link to='/signup' className='form-submit-link form-submit-link-create' >
                            Don't have an account?
                        </Link> 
                    </div>
                    <input type="submit"  id="submit" value='Forgot' />
                </div>
       
            </form>
        ) 
    }
    
}

export default Forgot
