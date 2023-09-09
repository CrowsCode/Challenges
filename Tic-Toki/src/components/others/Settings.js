import React,{useState, useEffect} from 'react'
import firebase from 'firebase/app'
import 'firebase/auth';

import { Redirect } from 'react-router';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import Loading from '../others/Loading'
import './settings.scss'

function Settings(props) {
  
    const [newPassword, set_newPassword] = useState('')
    const [newEmail, set_newEmail] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [currentEmail, set_currentEmail] = useState('')
    const [deleteAccount, set_deleteAccount] = useState(false)
    const [display_email, set_display_email] = useState(false)

    useEffect(() => {

        if(props.user !== null && props.user !== 'notNull'){
            set_display_email(props.user.email)
        }
          // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [props.user]) 


     function showStateOnDom(id, display, innerHTML, style){
        document.getElementById(id).style.display = display
        document.getElementById(id).innerHTML = innerHTML
        document.getElementById(id).style.color = style
    }


    function switchCheck(id){   
        document.getElementById(id).checked =  !(document.getElementById(id).checked)
    }

    function sendEmailVerification(){
        const user = firebase.auth().currentUser
        user.sendEmailVerification().then(function() {
            // console.log(`verification email sent to ${user.email}`)
        }).catch( (error) => {
            // console.log(`${error}  Couldn't send verification email to ${user.email}`)
        });
    }

    function isOnline(){
        //navigator.onLine will return the status whether it is online or offline but it wont check internet connectivity is there or not
        let condition = navigator.onLine ? 'online' : 'offline';
        if (condition === 'online') {
          console.log('ONLINE');
            fetch('https://www.google.com/', { // Check for internet connectivity
                mode: 'no-cors',
    })    .then(() => {    return true    }).catch(() => {   return false    }  )//false >> INTERNET CONNECTIVITY ISSUE
        }else{
           return false
        }
    }
    
    function updateAccountSettings(type, exitPopup){

        if(isOnline() === false){
            showStateOnDom(`s-result-${type}`, 'block', 'No Internet Connection', 'red');
            return;
        }

        const user = firebase.auth().currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(currentEmail, currentPassword);
        user.reauthenticateWithCredential(credential).then( () => {//`Account re-authenticated sucessfuly`

            if(type === 'email'){
                user.updateEmail(newEmail).then( () => {
                    switchCheck(exitPopup);    set_display_email(newEmail);    set_newEmail('')
                    setCurrentPassword('');        set_currentEmail('')

                    showStateOnDom('s-result-email', 'none')  
                }).catch( (error) => {
                    showStateOnDom('s-result-email', 'block', error, 'red')//email failed
                });
            }else if(type === 'password'){
                //var newPassword = getASecureRandomPassword();
                user.updatePassword(newPassword).then( () => {
                    switchCheck(exitPopup);    set_newPassword('')
                    setCurrentPassword('');        set_currentEmail('')

                    showStateOnDom('s-result-password', 'none')
                }).catch( (error) => {
                    showStateOnDom('s-result-password', 'block', error, 'red')//password failed
                });
            }else if(type === 'delete'){
                user.delete().then( () => {
                    switchCheck(exitPopup)
                    setCurrentPassword('');        set_currentEmail('')

                    showStateOnDom('s-result-delete', 'none')
                }).catch( (error) => {
                    showStateOnDom('s-result-delete', 'block', error, 'red')//delete failed
                });
            }
            
        }).catch( (error) => {
            showStateOnDom(`s-result-${type}`, 'block', error, 'red')//reauthenticateWithCredential failed
        });
    }

    if(props.user === null){
        return (    <Redirect    to='/'  />    )
    }else if(props.user === 'notNull'){
        return (<Loading  />)    
    }else {
        return ( 
            <div id='settings-container'>
                <div id='account-settings'>

                    <div className='settings-title'>Account Settings</div>

                    <div id='account-settings-stuff'>
                      

                        <div className='s-section'>
                            <div className='s-section-edits'>
                                <input className='s-check-button hide' id='check-button-new-email' type='checkBox'/>  {/*  id u htmlFor'aka bo awaya ka click lasar label kra switch ka   */}
                                <span className='s-check-header-text'>Email</span>  {/* boya hide m bakar henawa https://css-tricks.com/places-its-tempting-to-use-s-section-display-none-but-dont/ */}
                                <label  className='s-check-label' htmlFor='check-button-new-email'>  
                                    <FontAwesomeIcon icon={faEdit} />  
                                </label>
                                <label className='s-section-edits-popup-background' htmlFor='check-button-new-email'>{/*background aka bo awaya ka clikct krd awa la regai htmlFor aka input i check aka switch abe */}
                                  
                                    <form className='s-section-edits-popup-container' onSubmit={(e) =>{ e.preventDefault();  updateAccountSettings('email', 'check-button-new-email')}}>
                                        <div className='s-section-edits-popup-divs'>
                                            <div className='s-section-edits-popup-div'>
                                                <label  className='s-section-edits-popup-label' htmlFor='current-email-changeEmail'>Current Email</label>
                                                <input className='s-section-edits-popup-input' id='current-email-changeEmail' 
                                                    onChange={(e)=>set_currentEmail(e.target.value)} value={currentEmail} type='email' required placeholder=" " name='current-email'/>
                                            </div>
                                            <div className='s-section-edits-popup-div'>
                                                <label  className='s-section-edits-popup-label' htmlFor='current-password-changeEmail'>Current Password</label>
                                                <input className='s-section-edits-popup-input' id='current-password-changeEmail' 
                                                    onChange={(e)=>setCurrentPassword(e.target.value)} value={currentPassword} type='password' required placeholder=" " name='current-password'/>
                                            </div>
                                            <div className='s-section-edits-popup-div'>
                                                <label  className='s-section-edits-popup-label' htmlFor='new-email-changeEmail'>New Email</label>
                                                <input className='s-section-edits-popup-input' id='new-email-changeEmail' 
                                                    onChange={(e)=>set_newEmail(e.target.value)} value={newEmail} type='email' autoComplete='off' required placeholder=" " name='new-email'/>
                                            </div>
                                            <div id='s-result-email'></div>
                                        </div>

                                    

                                        <div className='s-section-edits-popup-buttons'>
                                            <input className='s-section-edits-popup-button-save' type="submit" value='save'/>
                                            <button className='s-section-edits-popup-button-close' onClick={(e) =>{ e.preventDefault(); switchCheck('check-button-new-email')}}>close</button>
                                        </div>
                                    </form>
                               
                                </label>
                            </div>
                            <div className='s-section-display'>{display_email}</div>  
                        </div>

                    


                        <div className='s-section'>
                            <div className='s-section-edits'>  
                                <input className='s-check-button hide' id='check-button-new-password' type='checkBox'/> 
                                <span className='s-check-header-text'>Password</span>
                                <label  className='s-check-label' htmlFor='check-button-new-password'>  
                                    <FontAwesomeIcon icon={faEdit} />  
                                </label>
                                <label className='s-section-edits-popup-background' htmlFor='check-button-new-password'> 
                                    <form className='s-section-edits-popup-container'  onSubmit={(e) =>{ e.preventDefault(); updateAccountSettings('password','check-button-new-password')}} >
                                        <div className='s-section-edits-popup-divs'>
                                            <div className='s-section-edits-popup-div'>
                                                <label  className='s-section-edits-popup-label' htmlFor='current-email-changePassword'>Current Email</label>
                                                <input className='s-section-edits-popup-input' id='current-email-changePassword' 
                                                    onChange={(e)=>set_currentEmail(e.target.value)} value={currentEmail} type='email' required placeholder=" " name='current-email'/>
                                            </div>
                                            <div className='s-section-edits-popup-div'>
                                                <label  className='s-section-edits-popup-label' htmlFor='current-password-changePassword'>Current Password</label>
                                                <input className='s-section-edits-popup-input' id='current-password-changePassword' 
                                                    onChange={(e)=>setCurrentPassword(e.target.value)} value={currentPassword} type='password' required placeholder=" " name='current-password'/>
                                            </div>
                                            <div className='s-section-edits-popup-div'>
                                                <label  className='s-section-edits-popup-label' htmlFor='new-password-changePassword'>New Password</label>
                                                <input className='s-section-edits-popup-input' id='new-password-changePassword' 
                                                    onChange={(e)=>set_newPassword(e.target.value)} value={newPassword} type='password' autoComplete='off' required placeholder=" " name='new-password'/>
                                                <div className="s-hint">password should be over 6 characters</div>
                                            </div>

                                            <div id='s-result-password'></div>
                                        </div>


                                        <div className='s-section-edits-popup-buttons'>
                                            <input className='s-section-edits-popup-button-save' type="submit" value='save'/>
                                            <button className='s-section-edits-popup-button-close' onClick={(e) =>{ e.preventDefault(); switchCheck('check-button-new-password')}}>close</button>
                                        </div>
                                    </form>
                                </label> 
                            </div>
                            <div className='s-section-display'>Password</div>  
                        </div>


                        <div id='verification'>
                            <div id='verification-text'>verified?</div> 
                            {props.user.emailVerified === false ? <button id='send-verification-button' onClick={sendEmailVerification}>Send verification</button>
                            : <div id='verification-verified-text'>Email Verified</div> }
                        </div>

                        
                        <div className='delete-s-section'>
                            <div className='s-section-edits'> 
                                <input className='s-check-button hide' id="check-button-delete-account" type="checkbox" onChange={()=> set_deleteAccount(!deleteAccount)} checked={deleteAccount} />  {/*   hide kret  u ba click lasar label toggle kre   */}
                                <label className='s-check-label' htmlFor="check-button-delete-account">Delete Account</label>  
                                <label className='s-section-edits-popup-background' htmlFor="check-button-delete-account">
                                    <form className='s-section-edits-popup-container' onSubmit={(e) =>{ e.preventDefault(); updateAccountSettings('delete', 'check-button-delete-account')}}>
                                        <div className='s-section-edits-popup-divs'>
                                            <div className='s-section-edits-popup-div'>
                                                <label  className='s-section-edits-popup-label' htmlFor='current-email-delete'>Current Email</label>
                                                <input className='s-section-edits-popup-input' id='current-email-delete' 
                                                    onChange={(e)=>set_currentEmail(e.target.value)} value={currentEmail} type='email' required placeholder=" " name='current-email'/>
                                            </div>
                                            <div className='s-section-edits-popup-div'>
                                                <label  className='s-section-edits-popup-label' htmlFor='current-password-delete'>Current Password</label>
                                                <input className='s-section-edits-popup-input' id='current-password-delete' 
                                                    onChange={(e)=>setCurrentPassword(e.target.value)} value={currentPassword} type='password' required placeholder=" " name='current-password'/>
                                            </div>

                                            
                                            <div id='s-result-delete'></div>
                                        </div>

                                        <div className='s-section-edits-popup-buttons'>
                                            <input className='s-section-edits-popup-button-save' type="submit" value='save'/>
                                            <button className='s-section-edits-popup-button-close' onClick={(e) =>{ e.preventDefault(); switchCheck('check-button-delete-account')}}>close</button>
                                        </div>
                                    </form>
                                </label>
                            </div>
                        </div>
                    
                    </div>
                </div>

                <div id='general-settings'>
                    <div className='settings-title'>General Settings</div>
                    <div id='general-settings-stuff'>
                        <button id='dark-mode'>
                            Dark Mode
                            <div id='dark-mode-hint'>Coming Soon...</div>
                        </button>
                    </div>
                </div>

                 

                
            </div>
        )
    }
}

export default Settings
