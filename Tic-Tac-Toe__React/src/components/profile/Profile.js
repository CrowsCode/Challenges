import React,{useState, useEffect} from 'react'
import { Redirect } from 'react-router';
import firebase from 'firebase/app'
import 'firebase/storage';    
import 'firebase/database'; 

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEdit } from '@fortawesome/free-solid-svg-icons';

import './profile.scss'
import Loading from '../others/Loading'


import profileFallBackPhoto from '../../images/default_profile_photo.png';


export default function Profile(props) {
        
    const [progressUpload, set_progressUpload] = useState(0)

    const [bio, setBio] = useState('')
    const [newBio, set_newBio] = useState('')

    const [gender, setGender] = useState('')
    const [newGender, set_newGender] = useState('')

    const [location, setLocation] = useState('')
    const [newLocation, set_newLocation] = useState('')

    const [display_name, set_display_name] = useState('')
    const [newName, set_newName] = useState('')
    

    const [userInfoObject, set_userInfoObject] = useState(null)
    const [component_error_manager, set_component_error_manager] = useState(null)

    const [gameresults_object, set_gameresults_object] = useState(null)
    const [gameresults_percentages, set_gameresults_percentages] = useState(null)

    const [level_progressBar, set_level_progressBar] = useState(null)
    
   
    useEffect(() => {

        if(props.user !== null && props.user !== 'notNull'){
            function get_userInfo(){
                firebase.database().ref(`users/${props.user.uid}/userInfo`).once('value').then( snapshot =>{ 
                    if(snapshot.exists()){  
                        let temp_userInfoObject = snapshot.val()   
                        setBio( temp_userInfoObject.bio )
                        setGender( temp_userInfoObject.gender )
                        setLocation( temp_userInfoObject.location )
                        set_userInfoObject(temp_userInfoObject)   

                        set_display_name( props.user.displayName )
                        ////
                        set_newBio( temp_userInfoObject.bio )
                        set_newGender( temp_userInfoObject.gender )
                        document.getElementById( temp_userInfoObject.gender ).checked = true;
                        set_newLocation( temp_userInfoObject.location )
                        set_newName( props.user.displayName )
                        ////  
                        setup_level_progressBar(temp_userInfoObject)
                        setup_gameResults_progressBars()
                        ////
                     }
                    else{    set_component_error_manager('User\'s Information doesn\'t exist')     }
                }, error => {     set_component_error_manager('lack of permission getting user informations: ',error)    })
            }
            get_userInfo()          
        }
          // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [props])

     
     function showStateOnDom(id, display, innerHTML, style){
        document.getElementById(id).style.display = display
        document.getElementById(id).innerHTML = innerHTML
        document.getElementById(id).style.color = style
    }
 

    function setup_level_progressBar(userInfo){
        let temp_level_progressBar = {}
        temp_level_progressBar.percentage = Math.round((userInfo.xp/userInfo.xpNeededToLevelUp)*100)
        temp_level_progressBar.xp = userInfo.xp
        temp_level_progressBar.xpNeededToLevelUp = userInfo.xpNeededToLevelUp

        document.getElementById('p-level-progressBar-value').style.width = temp_level_progressBar === null ? '100%' : temp_level_progressBar.percentage+'%'

        set_level_progressBar(temp_level_progressBar)
    }

    async function setup_gameResults_progressBars(){
        let temp_gameResults = {};
        await firebase.database().ref(`users/${props.user.uid}/gameResults/`).once('value').then( (snap) => { 
            if(snap.exists()){
                temp_gameResults = snap.val()
            }else{          }//'User\'s Game Results doesn\'t exist'
        }, error => {         })//'lack of permission getting game results: ' 

        if(temp_gameResults === undefined){  return; }//wata agar gameResults nabu
        let gameTypes = ['playerVsComputer', 'playerVsPlayer']
        for(let i=0; i<gameTypes.length; i++){
            if(temp_gameResults[gameTypes[i]] === undefined){
                temp_gameResults[gameTypes[i]] = {}
                temp_gameResults[gameTypes[i]].gamesWon = 0;     
                temp_gameResults[gameTypes[i]].gamesDraw = 0;     
                temp_gameResults[gameTypes[i]].gamesLost = 0; 
            }else{
                temp_gameResults[gameTypes[i]].gamesWon = temp_gameResults[gameTypes[i]].gamesWon === undefined ? 0 : temp_gameResults[gameTypes[i]].gamesWon
                temp_gameResults[gameTypes[i]].gamesDraw = temp_gameResults[gameTypes[i]].gamesDraw === undefined ? 0 : temp_gameResults[gameTypes[i]].gamesDraw
                temp_gameResults[gameTypes[i]].gamesLost = temp_gameResults[gameTypes[i]].gamesLost === undefined ? 0 : temp_gameResults[gameTypes[i]].gamesLost
            }
        }// temp_gameResults >> harduki tya abe tananat agar hardu type akash undefined bubn

        let percentages = {}, all = 0
        for(let i=0; i<gameTypes.length; i++){
            all = 0
            all = temp_gameResults[gameTypes[i]].gamesWon + temp_gameResults[gameTypes[i]].gamesLost + temp_gameResults[gameTypes[i]].gamesDraw
            percentages[gameTypes[i]] =  {}
            if(all !== 0){
                percentages[gameTypes[i]].allZero = false
                percentages[gameTypes[i]].gamesWon = Math.round((temp_gameResults[gameTypes[i]].gamesWon/all)*100)
                percentages[gameTypes[i]].gamesDraw = Math.round((temp_gameResults[gameTypes[i]].gamesDraw/all)*100)
                percentages[gameTypes[i]].gamesLost = Math.round((temp_gameResults[gameTypes[i]].gamesLost/all)*100)
            }else{
                percentages[gameTypes[i]].allZero = true
                percentages[gameTypes[i]].gamesWon = 0
                percentages[gameTypes[i]].gamesDraw = 0
                percentages[gameTypes[i]].gamesLost = 0
            }
        }//percentages >> bas aw gameType'i tya abe ka definied bua sarata
        if(percentages.playerVsComputer !== undefined){ 
            let a = percentages.playerVsComputer
            if(percentages.playerVsComputer.allZero === true){
                document.getElementById('p-playerVsComputer-progressBar').style.background = `gray`
            }else{
                document.getElementById('p-playerVsComputer-progressBar').style.background = 
                `linear-gradient(to right, green ${a.gamesWon}%, yellow ${a.gamesWon}% ${a.gamesWon + a.gamesDraw}%, red ${a.gamesWon + a.gamesDraw}%)`
            }
        }
        if(percentages.playerVsPlayer !== undefined){  
            let a = percentages.playerVsPlayer
            if(percentages.playerVsPlayer.allZero === true){
                document.getElementById('p-playerVsPlayer-progressBar').style.background = `gray`
            }else{
                document.getElementById('p-playerVsPlayer-progressBar').style.background = 
                    `linear-gradient(to right, green ${a.gamesWon}%, yellow ${a.gamesWon}% ${a.gamesWon + a.gamesDraw}%, red ${a.gamesWon + a.gamesDraw}%)`
            }
        }
        set_gameresults_percentages(percentages)
        set_gameresults_object(temp_gameResults)
    }

    function setNameFunction(e){
        const word = e.target.value, regex = /\w/g 

        if(word.length > 9){     return;    }
        for(let i=0; i<word.length ; i++ )   {    if(regex.test(word) === false){   return;    }      }
        set_newName(word);
    }

    function setLocationFunction(e){
        const word = e.target.value, regex = /\w/g 
        for(let i=0; i<word.length ; i++ )   {    if(regex.test(word) === false){   return;    }      }
        set_newLocation(word);
    }

    function switchCheck(id){    
        document.getElementById(id).checked =  false;         
    }

    function fileHandler(event){
        const file = event.target.files[0]
        const profilePhotoRef = firebase.storage().ref(`profilePhotos/${props.user.uid}/profilePhoto`)
        const uploadTask =  profilePhotoRef.put(file)  //ka put akre awai pesh law shwena asreto
        uploadTask.on('state_changed', (snapshot) =>     {
            const progressCurrent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            set_progressUpload(progressCurrent)
        },(error) => {    }//Error while updating profile picture 
          , () =>{  //parameter'i 3 yam hi kateka ka complete abe 

            profilePhotoRef.getDownloadURL().then( (url) => {
                props.user.updateProfile({    photoURL: url    }).then(() => {//User profile updated succesfuly
                 
                    firebase.database().ref(`users/${props.user.uid}/userInfo/`).update(  {photoURL:url})

                }).catch((error) => {     });//Couldn\'t update user profile
            }).catch((error) => {      })//downloading profile photo\'s url failed
        })
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

    function save(type, exitPopup){
        
        if(type === 'name'){
            if(isOnline() === false){
                showStateOnDom('p-result-name', 'block', 'No Internet Connection', 'red');
                return;
            }
            if(newName.length < 3){
                showStateOnDom('p-result-name', 'block', 'Name: Name should be greater or equal to 3 characters', 'red');
                return;
            }
            else if(newName.length > 9){ 
                showStateOnDom('p-result-name', 'block', 'Name: Name should be less than 10 characters', 'red');
                return;
            }
            firebase.database().ref(`allNameAndUIDs/`).once('value').then( (snapshot) => {
                let allNamesObject = snapshot.val() 
                allNamesObject = allNamesObject === null ? {} : allNamesObject
                let allNamesArray = Object.keys(allNamesObject)

                if(!allNamesArray.includes(newName.toLowerCase())){
                    props.user.updateProfile({    displayName: newName.toLowerCase()    }).then(() => {
                        set_display_name( newName )
                    }).catch((error) => {     });//Couldn\'t update user profile(name)
                    firebase.database().ref(`users/${props.user.uid}/userInfo/`).update({name: newName.toLowerCase() }); 
        
                    for(let i=0; i< allNamesArray.length; i++){
                        if(allNamesObject[allNamesArray[i]] === props.user.uid){
                            delete allNamesObject[allNamesArray[i]] 
                            break;
                        }
                    }
                    allNamesObject[newName.toLowerCase()] = props.user.uid
                    firebase.database().ref('/').update({allNameAndUIDs: allNamesObject }); 
                    switchCheck(exitPopup)

                    showStateOnDom('p-result-name', 'none');
                }else{    
                    showStateOnDom('p-result-name', 'block', 'Name: Name isn\'t unique', 'red');
                }
            }) 
        }else if(type === 'bio'){
            firebase.database().ref(`users/${props.user.uid}/userInfo/`).update({bio: newBio});
            setBio(newBio)
            //set_newBio(newBio) har haman value i habe
            switchCheck(exitPopup)
        }else if(type === 'gender'){
            firebase.database().ref(`users/${props.user.uid}/userInfo/`).update({gender: newGender});
            setGender(newGender)
            //set_newGender(newGender)  har haman value i habe
            switchCheck(exitPopup)
        }else if(type === 'location'){
            firebase.database().ref(`users/${props.user.uid}/userInfo/`).update({location: newLocation});
            setLocation(newLocation)
            //set_newLocation('')  har haman value i habe
            switchCheck(exitPopup)
        }    
    }

   

    if(props.user === 'notNull'){
        return (<Loading  />)
    }else if(props.user === null || component_error_manager !== null){
        if(component_error_manager !== null){
            return(    <Redirect    to={{    pathname: "/404",    state: { from: 'Profile',  error: component_error_manager }    }}    />    )
        } 
        return (    <Redirect    to='/'  />    )
    }else {
        return(
            <div id='profile-container'>
                        
                <div id='name-bio-gender-location'>

                    <div className='p-section'>{/* lera  className='p-section-edits-popup-divs' nya chunka yaki yak input yan tyaya */}
                        <div className='p-section-edits'>
                            <input className='p-check-button hide' id='check-button-new-name' type='checkBox'/> 
                            <span className='p-check-header-text'>Name</span>
                            <label  className='p-check-label' htmlFor='check-button-new-name'>  
                                <FontAwesomeIcon icon={faEdit} />  
                            </label>
                            <label className='p-section-edits-popup-background' htmlFor='check-button-new-name'> {/*  ka checked bu awa ama dar kawe  */}
                                <form className='p-section-edits-popup-container' onSubmit={(e) =>{ e.preventDefault(); save('name', 'check-button-new-name')}}>
                                
                                    <div className='p-section-edits-popup-div'>
                                        <label  className='p-section-edits-popup-label' htmlFor='new-name'>New Name</label>
                                        <input className='p-section-edits-popup-input' id='new-name' 
                                            onChange={(e)=>setNameFunction(e)} value={newName} type='text' required placeholder=" " name='new-name'/>  
                                        <div className="p-hint">name should be over 3 characters and less than 10 characters</div>
                                        <div id='p-result-name'></div>
                                    </div>

                                   
                                
                                    <div className='p-section-edits-popup-buttons'>
                                        <input className='p-section-edits-popup-button-save' type="submit" value='save'/>
                                        <button className='p-section-edits-popup-button-close' onClick={() => switchCheck('check-button-new-name')}>close</button>
                                    </div>
                                </form>
                            </label>
                        </div>
                        <div className='p-section-display'>{display_name}</div>  
                    </div>



                    <div className='p-section p-section-bio'>
                        <div className='p-section-edits'>
                            <input className='p-check-button hide' id='check-button-new-bio' type='checkBox'/> 
                            <span className='p-check-header-text'>Bio</span>
                            <label  className='p-check-label' htmlFor='check-button-new-bio'>  
                                <FontAwesomeIcon icon={faEdit} />  
                            </label>
                            <label className='p-section-edits-popup-background' htmlFor='check-button-new-bio'> 
                                <form className='p-section-edits-popup-container' onSubmit={(e) =>{ e.preventDefault(); save('bio', 'check-button-new-bio')}}>
                                
                                    <div className='p-section-edits-popup-div'>
                                        <label  className='p-section-edits-popup-label' htmlFor='new-bio'>New Bio</label>
                                        <textarea className='p-section-edits-popup-input-textarea' id='new-bio' maxLength='100' onChange={(e) => set_newBio(e.target.value)} value={newBio} required/>{/* ama jyawaz  */}
                                        <div className="p-hint">bio should be less than or equal to 40 characters</div>
                                    </div>
                                   
                                    <div className='p-section-edits-popup-buttons'>
                                        <input className='p-section-edits-popup-button-save' type="submit" value='save'/>
                                        <button className='p-section-edits-popup-button-close' onClick={() => switchCheck('check-button-new-bio')}>close</button>
                                    </div>
                                </form>
                            </label>
                        </div>
                        <div className='p-section-display p-section-display-bio'>{bio}</div>  
                    </div>

                    <div className='p-section'>
                        <div className='p-section-edits'>
                            <input className='p-check-button hide' id='check-button-new-gender' type='checkBox'/> 
                            <span className='p-check-header-text'>Gender</span>
                            <label  className='p-check-label' htmlFor='check-button-new-gender'>  
                                <FontAwesomeIcon icon={faEdit} />  
                            </label>
                            <label className='p-section-edits-popup-background' htmlFor='check-button-new-gender'>
                                <form className='p-section-edits-popup-container' onSubmit={(e) =>{ e.preventDefault(); save('gender', 'check-button-new-gender')}}>
                                    <div className='p-section-edits-popup-divs-radio'>
                                        <div className='p-section-edits-popup-div-radio'>
                                            <input className='p-section-edits-popup-input-radio' id="male" 
                                                onChange={(e)=> { set_newGender(e.target.value) }} value="male" type="radio" required placeholder=" " name="new-gender" />
                                            <label className='p-section-edits-popup-label-radio' htmlFor="male">Male</label>
                                        </div>
                                            <div className='p-section-edits-popup-div-radio'>
                                                <input className='p-section-edits-popup-input-radio' id="female" 
                                                    onChange={(e)=> { set_newGender(e.target.value) }} value="female" type="radio" required placeholder=" " name="new-gender" />
                                                <label className='p-section-edits-popup-label-radio' htmlFor="female">Female</label>
                                            </div>
                                        <div className='p-section-edits-popup-div-radio'>
                                            <input className='p-section-edits-popup-input-radio' id="Cisgender" 
                                                onChange={(e)=> { set_newGender(e.target.value) }} value="Cisgender" type="radio" required placeholder=" " name="new-gender" />
                                            <label className='p-section-edits-popup-label-radio' htmlFor="Cisgender">Cisgender</label>
                                        </div>
                                        <div className='p-section-edits-popup-div-radio'>
                                            <input className='p-section-edits-popup-input-radio' id="Two-Spirit" 
                                                onChange={(e)=> { set_newGender(e.target.value) }} value="Two-Spirit" type="radio" required placeholder=" " name="new-gender" />
                                            <label className='p-section-edits-popup-label-radio' htmlFor="Two-Spirit" >Two-Spirit</label>
                                        </div>
                                        <div className='p-section-edits-popup-div-radio'>
                                            <input className='p-section-edits-popup-input-radio' id="Gender-Neutral" 
                                                onChange={(e)=> { set_newGender(e.target.value) }} value="Gender-Neutral" type="radio" required placeholder=" " name="new-gender" />
                                            <label className='p-section-edits-popup-label-radio' htmlFor="Gender-Neutral" >Gender-Neutral</label>
                                        </div>
                                        <div className='p-section-edits-popup-div-radio'>
                                            <input className='p-section-edits-popup-input-radio' id="Agender" 
                                                onChange={(e)=> { set_newGender(e.target.value) }} value="Agender" type="radio" required placeholder=" " name="new-gender" />
                                            <label className='p-section-edits-popup-label-radio' htmlFor="Agender" >Agender</label>
                                        </div>
                                        <div className='p-section-edits-popup-div-radio'>
                                            <input className='p-section-edits-popup-input-radio' id="neither" 
                                                onChange={(e)=> { set_newGender(e.target.value) }} value="neither" type="radio" required placeholder=" " name="new-gender" />
                                            <label className='p-section-edits-popup-label-radio' htmlFor="neither" >neither</label>
                                        </div>
                                    </div> 
                                    <div className='p-section-edits-popup-buttons'>
                                        <input className='p-section-edits-popup-button-save' type="submit" value='save'/>
                                        <button className='p-section-edits-popup-button-close' onClick={() => switchCheck('check-button-new-gender')}>close</button>
                                    </div>
                                </form>
                            </label>
                        </div>
                        <div className='p-section-display'>{gender}</div>  
                    </div>



                    <div className='p-section'>
                        <div className='p-section-edits'>
                            <input className='p-check-button hide' id='check-button-new-location' type='checkBox'/> 
                            <span className='p-check-header-text'>Location</span>
                            <label  className='p-check-label' htmlFor='check-button-new-location'>  
                                <FontAwesomeIcon icon={faEdit} />  
                            </label>
                            <label className='p-section-edits-popup-background' htmlFor='check-button-new-location'> 
                                <form className='p-section-edits-popup-container' onSubmit={(e) =>{ e.preventDefault(); save('location', 'check-button-new-location')}}>
                            
                                    <div className='p-section-edits-popup-div'>
                                        <label  className='p-section-edits-popup-label' htmlFor='new-location'>New Location</label>
                                        <input className='p-section-edits-popup-input' id='new-location' 
                                            onChange={(e)=>setLocationFunction(e)} value={newLocation} type='text' required placeholder=" " name='new-location'/> 
                                    </div> 
                                    
                                    <div className='p-section-edits-popup-buttons'>
                                        <input className='p-section-edits-popup-button-save' type="submit" value='save'/>
                                        <button className='p-section-edits-popup-button-close' onClick={() => switchCheck('check-button-new-location')}>close</button>
                                    </div>
                                </form>
                            </label>
                        </div>
                        <div className='p-section-display'>{location}</div>  
                    </div>

                </div>

              

                <div id='p-photo-level-gameResults'>

                  
                        <div id='p-photo-stuff'>
                            <img id='p-photo' src={props.user.photoURL} alt='profile' onError={(e)=>{e.target.onerror = null; e.target.src=profileFallBackPhoto }} />
                            <div id='p-upload-stuff'>
                            <progress id="p-upload-progress" value={progressUpload} max="100"> </progress>
                                <label id='p-upload-photo-text' htmlFor="p-input-uplaod">Upload</label>
                                <input id="p-input-uplaod" className='hide' onChange={(event) => fileHandler(event)} type='file' />
                               
                            </div>
                        </div>

                        <div id='p-level-stuff'>
                            <div id='p-level-text'>
                                <span id='p-level-beforeText'>Level: </span>
                                <span id='p-level'> {userInfoObject === null ? '' : userInfoObject.level}</span>
                            </div>
                            {/* <progressUpload id="level-progressUpload" value={userInfoObject === null ? '100' : userInfoObject.xp} max={userInfoObject === null ? '100' : userInfoObject.xpNeededToLevelUp}>hh</progressUpload> */}
                            <div id="p-level-progressBar" >
                                <div id="p-level-progressBar-value"></div>
                                <span id="p-level-progressBar-value-text">{level_progressBar === null ? '0' : `${level_progressBar.xp}xp / ${level_progressBar.xpNeededToLevelUp}xp `}</span>
                            </div>
                            <div id='p-level-hover'>
                                <span id='p-level-hover-percentage'>{level_progressBar === null ? '0' : level_progressBar.percentage}%</span>
                            </div>
                        </div> 
                   
    

                    <div id='p-gameResults'>
                        <div className='p-gameResults-gameType'>
                            <div className='p-gameType-text'>Player Vs Computer</div>
                            <div className='p-gameType-progressBar-and-stats'>
                                <div className='p-gameType-progressBar' id='p-playerVsComputer-progressBar'></div>
                                <div className='p-gameType-percentages-hover'>
                                    <span className='p-gameType-percentages-gamesWon'>{gameresults_object === null ? '0' : gameresults_percentages.playerVsComputer.gamesWon}%</span>
                                    <span className='p-gameType-percentages-gamesDraw'>{gameresults_object === null ? '0' : gameresults_percentages.playerVsComputer.gamesDraw}%</span>
                                    <span className='p-gameType-percentages-gamesLost'>{gameresults_object === null ? '0' : gameresults_percentages.playerVsComputer.gamesLost}%</span>
                                </div>
                                <div className='p-gameType-stats'>
                                    <span className='p-gameType-stats-gamesWon'>{gameresults_object === null ? '0' : gameresults_object.playerVsComputer.gamesWon} wins </span>
                                    <span className='p-gameType-stats-gamesDraw'>{gameresults_object === null ? '0' : gameresults_object.playerVsComputer.gamesDraw} draws </span>
                                    <span className='p-gameType-stats-gamesLost'>{gameresults_object === null ? '0' : gameresults_object.playerVsComputer.gamesLost} loses</span>
                                </div>
                            </div>
                        </div>

                        <div className='p-gameResults-gameType' id='p-gameResults-playerVsPlayer'>
                            <div className='p-gameType-text'>Player Vs Player</div>
                            <div className='p-gameType-progressBar-and-stats'>
                                <div className='p-gameType-progressBar' id='p-playerVsPlayer-progressBar'></div>
                                <div className='p-gameType-percentages-hover'>
                                    <span className='p-gameType-percentages-gamesWon'>{gameresults_object === null ? '0' : gameresults_percentages.playerVsPlayer.gamesWon}%</span>
                                    <span className='p-gameType-percentages-gamesDraw'>{gameresults_object === null ? '0' : gameresults_percentages.playerVsPlayer.gamesDraw}%</span>
                                    <span className='p-gameType-percentages-gamesLost'>{gameresults_object === null ? '0' : gameresults_percentages.playerVsPlayer.gamesLost}%</span>
                                </div>
                                <div className='p-gameType-stats'>
                                    <span className='p-gameType-stats-gamesWon'>{gameresults_object === null ? '0' : gameresults_object.playerVsPlayer.gamesWon} wins</span>
                                    <span className='p-gameType-stats-gamesDraw'>{gameresults_object === null ? '0' : gameresults_object.playerVsPlayer.gamesDraw} draws</span>
                                    <span className='p-gameType-stats-gamesLost'>{gameresults_object === null ? '0' : gameresults_object.playerVsPlayer.gamesLost} loses</span>
                                </div>
                            </div>
                        </div>
                    </div>          
                </div>

                   

            </div>
        )
    }
}
 