import React,{useState,useEffect} from 'react'
import firebase from 'firebase/app'
import 'firebase/database';
import {useLocation} from 'react-router-dom'
import './userProfile.scss'
import Loading from '../others/Loading'
import { Redirect } from 'react-router';

let name, UID
function UserProfile() {

    const location = useLocation();//la naw har function eki ka be ish naka sayir bu

    const [userInfoObject, set_userInfoObject] = useState(null) 

    const [gameresults_object, set_gameresults_object] = useState(null)
    const [gameresults_percentages, set_gameresults_percentages] = useState(null)
    const [level_progressBar, set_level_progressBar] = useState(null)

    const [component_error_manager, set_component_error_manager] = useState('loading')

    useEffect(() => {

        async function get_userInfo_gameResults(){// name match >>  getting nme UID >> getting userInfo using UID
            name = location.pathname.substr('/profile/'.length)

            firebase.database().ref(`allNameAndUIDs/`).once('value').then( (snapshot) =>{ 
                if(snapshot.exists()){
                    let allNamesObject = snapshot.val()
                    allNamesObject = allNamesObject === null ? {} : allNamesObject
                    const allNamesArray = Object.keys(allNamesObject) //returns an array of ALL names >>> bas array'a u uid yakani pewa nmawa
                    for (let i = 0; i < allNamesArray.length; i++) {
                        if(allNamesArray[i] === name){
                            UID = allNamesObject[allNamesArray[i]];
                            break;
                        }
                    } 

                    firebase.database().ref(`users/${UID}/userInfo`).once('value').then( (snapshot) => {
                        if(snapshot.exists()){
                            set_userInfoObject( snapshot.val() )
                            set_component_error_manager('gotData') 

                            setup_level_progressBar( snapshot.val() )
                            setup_gameResults_progressBars()
                      
                        }else{    set_component_error_manager('User\'s Information doesn\'t exist')    }     
                    }, error => {     set_component_error_manager('lack of permission getting user informations: ',error)    })

                }else{    set_component_error_manager('User\'s ID doesn\'t exist')    }     
            }, error => {     set_component_error_manager('lack of permission getting user\'s ID: ',error)    })  
        }

        get_userInfo_gameResults()
    }, [location.pathname])//console

    function setup_level_progressBar(userInfo){
        let temp_level_progressBar = {}
        temp_level_progressBar.percentage = Math.round((userInfo.xp/userInfo.xpNeededToLevelUp)*100)
        temp_level_progressBar.xp = userInfo.xp
        temp_level_progressBar.xpNeededToLevelUp = userInfo.xpNeededToLevelUp

        document.getElementById('u-level-progressBar-value').style.width = temp_level_progressBar === null ? '100%' : temp_level_progressBar.percentage+'%'

        set_level_progressBar(temp_level_progressBar)
     }
 
    async function setup_gameResults_progressBars(){
        let temp_gameResults = {};
        await firebase.database().ref(`users/${UID}/gameResults/`).once('value').then( (snap) => { 
            if(snap.exists()){
                temp_gameResults = snap.val()
            }else{      } //'User\'s Game Results doesn\'t exist'
        }, error => {      }) //'lack of permission getting game results: '

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
                document.getElementById('u-playerVsComputer-progressBar').style.background = `gray`
            }else{
                document.getElementById('u-playerVsComputer-progressBar').style.background = 
                    `linear-gradient(to right, green ${a.gamesWon}%, yellow ${a.gamesWon}% ${a.gamesDraw}%, red ${a.gamesDraw}% ${a.gamesLost}%)`
            }
        }
        if(percentages.playerVsPlayer !== undefined){  
            let a = percentages.playerVsPlayer
            if(percentages.playerVsPlayer.allZero === true){
                document.getElementById('u-playerVsPlayer-progressBar').style.background = `gray`
            }else{
                document.getElementById('u-playerVsPlayer-progressBar').style.background = 
                    `linear-gradient(to right, green ${a.gamesWon}%, yellow ${a.gamesWon}% ${a.gamesDraw}%, red ${a.gamesDraw}% ${a.gamesLost}%)`
            }
        }
        set_gameresults_percentages(percentages)
        set_gameresults_object(temp_gameResults)
    }


    if(component_error_manager === 'loading'){
        return (<Loading  />)
    }else if(component_error_manager !== null && component_error_manager !== 'gotData'){
        return(    <Redirect    to='/'  />    )
    }else if(component_error_manager === 'gotData'){
        return(
            <div id='userProfile-container'>

                <div id='name-bio-gender-location'>

                    <div className='u-section'>{/* lera  className='u-section-edits-popup-divs' nya chunka yaki yak input yan tyaya */}
                        <div className='u-section-header'>Name</div>
                        <div className='u-section-display'>{userInfoObject.name}</div>  
                    </div>

                    <div className='u-section u-section-bio'>
                        <div className='u-section-header'>Bio</div>
                        <div className='u-section-display-bio'>{userInfoObject.bio}</div>  
                    </div>

                    <div className='u-section'>
                        <div className='u-section-header'>Gender</div>
                        <div className='u-section-display'>{userInfoObject.gender}</div>  
                    </div>

                    <div className='u-section'>
                        <div className='u-section-header'>Location</div>
                        <div className='u-section-display'>{userInfoObject.location}</div>  
                    </div>

                </div>


                <div id='u-photo-level-gameResults'>

                                    
                    <div id='u-photo-stuff'>
                        <img id='u-photo' src={userInfoObject.photoURL} alt='profile' />
                    </div>

                    <div id='u-level-stuff'>
                        <div id='u-level-text'>
                            <span id='u-level-beforeText'>Level: </span>
                            <span id='u-level'> {userInfoObject === null ? '' : userInfoObject.level}</span>
                        </div>
                        {/* <progress id="level-progress" value={userInfoObject === null ? '100' : userInfoObject.xp} max={userInfoObject === null ? '100' : userInfoObject.xpNeededToLevelUp}>hh</progress> */}
                        <div id="u-level-progressBar" >
                            <div id="u-level-progressBar-value"></div>
                            <span id="u-level-progressBar-value-text">{level_progressBar === null ? '0' : `${level_progressBar.xp}xp / ${level_progressBar.xpNeededToLevelUp}xp `}</span>
                        </div>
                        <div id='u-level-hover'>
                            <span id='u-level-hover-percentage'>{level_progressBar === null ? '0' : level_progressBar.percentage}%</span>
                        </div>
                    </div> 



                    <div id='u-gameResults'>
                        <div className='u-gameResults-gameType'>
                            <div className='u-gameType-text'>Player Vs Computer</div>
                            <div className='u-gameType-progressBar-and-stats'>
                                <div className='u-gameType-progressBar' id='u-playerVsComputer-progressBar'></div>
                                <div className='u-gameType-percentages-hover'>
                                    <span className='u-gameType-percentages-gamesWon'>{gameresults_object === null ? '0' : gameresults_percentages.playerVsComputer.gamesWon}%</span>
                                    <span className='u-gameType-percentages-gamesDraw'>{gameresults_object === null ? '0' : gameresults_percentages.playerVsComputer.gamesDraw}%</span>
                                    <span className='u-gameType-percentages-gamesLost'>{gameresults_object === null ? '0' : gameresults_percentages.playerVsComputer.gamesLost}%</span>
                                </div>
                                <div className='u-gameType-stats'>
                                    <span className='u-gameType-stats-gamesWon'>{gameresults_object === null ? '0' : gameresults_object.playerVsComputer.gamesWon} wins </span>
                                    <span className='u-gameType-stats-gamesDraw'>{gameresults_object === null ? '0' : gameresults_object.playerVsComputer.gamesDraw} draws </span>
                                    <span className='u-gameType-stats-gamesLost'>{gameresults_object === null ? '0' : gameresults_object.playerVsComputer.gamesLost} loses</span>
                                </div>
                            </div>
                        </div>

                        <div className='u-gameResults-gameType' id='u-gameResults-playerVsPlayer'>
                            <div className='u-gameType-text'>Player Vs Player</div>
                            <div className='u-gameType-progressBar-and-stats'>
                                <div className='u-gameType-progressBar' id='u-playerVsPlayer-progressBar'></div>
                                <div className='u-gameType-percentages-hover'>
                                    <span className='u-gameType-percentages-gamesWon'>{gameresults_object === null ? '0' : gameresults_percentages.playerVsPlayer.gamesWon}%</span>
                                    <span className='u-gameType-percentages-gamesDraw'>{gameresults_object === null ? '0' : gameresults_percentages.playerVsPlayer.gamesDraw}%</span>
                                    <span className='u-gameType-percentages-gamesLost'>{gameresults_object === null ? '0' : gameresults_percentages.playerVsPlayer.gamesLost}%</span>
                                </div>
                                <div className='u-gameType-stats'>
                                    <span className='u-gameType-stats-gamesWon'>{gameresults_object === null ? '0' : gameresults_object.playerVsPlayer.gamesWon} wins</span>
                                    <span className='u-gameType-stats-gamesDraw'>{gameresults_object === null ? '0' : gameresults_object.playerVsPlayer.gamesDraw} draws</span>
                                    <span className='u-gameType-stats-gamesLost'>{gameresults_object === null ? '0' : gameresults_object.playerVsPlayer.gamesLost} loses</span>
                                </div>
                            </div>
                        </div>
                    </div> 


                </div>






            </div>
        )
    }
}

export default UserProfile



