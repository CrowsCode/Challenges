import React,{useState, useEffect} from 'react'
import firebase from 'firebase/app'
import 'firebase/auth';

import {Link} from 'react-router-dom'
import { Redirect } from 'react-router';

import './form.scss'

import Loading from '../others/Loading'
 
function Login(props) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        
        if(props.user === null){ //agar setUser sarata null bwaya nak 'notNull' awa ama run abu pesh awai har dom akash drust kre u abu ba error
            document.getElementById('form').style.gridTemplate = ' 1fr 1fr/ 1fr'
            document.getElementById('inputs-container').style.gridTemplate = ' 1fr 1fr/ 1fr'
        }
 
     }, [props.user])
        
     function showStateOnDom(id, display, innerHTML, style){
        document.getElementById(id).style.display = display
        document.getElementById(id).innerHTML = innerHTML
        document.getElementById(id).style.color = style
    }

    function login(e) {
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(email, password).then( (cred)=>{ 
                setPassword('')
                setEmail('')

                //document.getElementById('input-result').style.display = 'none'
        } ).catch((error) => {
                showStateOnDom('input-result', 'block', error, 'red')//signInWithEmailAndPassword failed
            });
    }
    
    
    
    if(props.user === 'notNull'){ 
        return (<Loading  />)
    }else if(props.user !== null){ 
        return (<Redirect  to="/" />)
    }else if(props.user === null){
        return (
            <div>
                <form onSubmit={ (e) => login(e)} id="form">

                    <div id="inputs-container">
                        <div className="input-div">
                            <input className="form-input" id="email" value={email} onChange={ (e) => setEmail(e.target.value) } type="email" placeholder=" "  required />
                            <div className="form-text">Email</div>
                        </div>

                        <div className="input-div">
                            <input className="form-input" id="password"  value={password} onChange={ (e) => setPassword(e.target.value) } type="password" placeholder=" "  required />
                            <div className="form-text">Password</div>
                        </div>

                        <div id='input-result'></div>

                    </div>

                    <div id='buttons-container'>
                        <div id='links'>
                            <Link to='/signUp' className='form-submit-link' >
                                Signup
                            </Link>
                            <Link to='/forgot' className='form-submit-link' >
                                Forgot
                            </Link>
                        </div>
                        <input type="submit"  id="submit" value='Login' />
                    </div>
                       
                </form>
            </div>
        )
    }else{
        return(
            <div>
                error
            </div>
        )
    }
} 

export default Login

 
