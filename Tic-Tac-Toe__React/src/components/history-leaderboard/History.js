import React,{useState, useEffect} from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore';
import { Redirect } from 'react-router';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import Loading from '../others/Loading'
import './history.scss'

function History(props) {

    const [collectionObject, set_collectionObject] = useState({})
    const [collectionArray, set_collectionArray] = useState('loading')
   
    
    useEffect(() => {
        if(props.user !== null && props.user !== 'notNull'){
            getGames()
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  
    
    function getGames(){
        
        let temp_collectionObject = {}, temp
  
        firebase.firestore().collection('users').doc(props.user.uid+'').collection('games').get().then( (snapshot) => { // eslint-disable-line no-loop-func
            snapshot.forEach((doc) => { 
                temp = doc.data();  
                temp_collectionObject[temp.finishedAt] = temp;   
            });//await la naw loop warning ayat boya aw eslint ai sarom danawa

            set_collectionObject( temp_collectionObject )
            temp_collectionObject = Object.keys(temp_collectionObject).sort((a, b) => b - a);//order aka reverse akato
            set_collectionArray( temp_collectionObject.length === 0 ? null : temp_collectionObject ) 

        }).catch( (error) => {    console.log("Error getting document:", error);    });
    }

 
    
    function remove(key){
        let object = collectionObject[key]
        //removebyOne_to_realTimeDatabase(object.gameType, object.gameResult)
        firebase.firestore().collection('users').doc(props.user.uid+'').collection('games').doc(object.doc_id).get()
        .then((doc)=> {
            doc.ref.delete().then(() => {
                //console.log("Document successfully deleted!");
              }).catch( (error) => {
                //console.error("Error removing document: ", error);
              });
            });
        let newArray = [...collectionArray]   // delete collectionObject[key] pewist nakat ka ba peyi key aka doc akan war agrin la xwaro har
        newArray.splice(newArray.indexOf(key), 1);
        set_collectionArray( newArray.length === 0 ? null : newArray )  
    }



   if(props.user === null){
        return (    <Redirect    to='/'    />    )
    }else if(props.user === 'notNull' || collectionArray === 'loading'){
        return (<Loading  />)
    }else {
        return(
            <div id='history-container'>

                <div id='header-container'>
                    <div className='header-text'>History</div>
                </div>

                {collectionArray === null ? <div id='noneToShow-history'>There isn't any history to show</div> :
                    collectionArray.map( key => {
                        let object = collectionObject[key]
                        
        
                        return( 
                            <div className='docBox' key={object.timeTheGameTook}>
                                <div className='docBox-2-half'> 
                                    <div className='docBox-players-and-others'>
                                
                                        <div className='docBox-players'>
                                            <div className='docBox-player' style={{backgroundColor: object.player1.color+'99'}}>
                                                <div className='docBox-player-nameSymbol'>
                                                    {object.player1.name} 
                                                    [<div className='docBox-player-symbol'>{object.player1.symbol}</div>]
                                                </div>
                                                <div className='docBox-player-points'>
                                                    <div className='docBox-player-points-text'>Points: </div>
                                                    <div className='docBox-player-point'>{object.player1.points}</div>
                                                </div>
                                            </div>

                                            <div className='docBox-player' style={{backgroundColor: object.player2.color+'99'}}>
                                                <div className='docBox-player-nameSymbol'>
                                                    {object.player2.name} 
                                                    [<div className='docBox-player-symbol'>{object.player2.symbol}</div>]
                                                </div>
                                                <div className='docBox-player-points'>
                                                    <div className='docBox-player-points-text'>Points: </div>
                                                    <div className='docBox-player-point'>{object.player2.points}</div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className='docBox-others'>
                                            <div className='docBox-size-and-gameType'>
                                                <div className='docBox-size-stuff'>
                                                    <div className='docBox-text-size'>Size: </div>
                                                    <div className='docBox-size'>{object.size}</div>
                                                </div>
                                                <div className='docBox-gameType' style={ object.gameType === 'playerVsPlayer'? {backgroundColor : '#0ced8040'} : {backgroundColor : '#0cd7ed40'} } > {/* hardukyan +40 krawn bo opacity */}
                                                    {object.gameType}
                                                </div>
                                            </div>
                                            <div className='docBox-time-stuff'>
                                                <div className='docBox-time-text'>Time game took: </div>
                                                <div className='docBox-time'>{object.timeTheGameTook_text}</div>
                                            </div>
                                            <div className='docBox-startedAt-stuff'>
                                                <div className='docBox-startedAt-text'>started at: </div>
                                                <div className='docBox-size'>{object.doc_id}</div>
                                            </div>
                                        
                                            { object.gameType === 'playerVsPlayer' ? '' :
                                                <div className='docBox-gainedXp-stuff'>
                                                    <div className='docBox-gainedXp-text'>Gained XP: </div>
                                                    <div className='docBox-gainedXp'>{object.gainedXp}</div>
                                                </div>
                                            }
                                            <div className='docBox-gameResult-stuff'
                                                style={ object.gameResult === 'gamesWon'? {backgroundColor : 'green'} : object.gameResult === 'gamesDraw'? {backgroundColor : 'orange'} : {backgroundColor : 'red'}} 
                                            >
                                                <div className='docBox-gameResult-text'>{object.player1.name} </div>
                                                <div className='docBox-gameResult'>{object.gameResult.substring('games'.length)}</div>
                                            </div>
                                        </div>

                                    </div>

                                    <button className='remove' onClick={ () => {remove(key)} }>
                                        <FontAwesomeIcon icon={faTrashAlt} />  
                                    </button>
                                </div>
                            </div>)
                    }  )
                }

            </div>
        )
    }
}

export default History


