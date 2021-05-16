import React,{useState,useEffect} from 'react'
import firebase from 'firebase/app'
import 'firebase/database';
import 'firebase/firestore';
import { Redirect } from 'react-router';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';  //faExchangeAlt//faSyncAlt
 
import Loading from '../others/Loading'
import './game.scss'


const originalColor = '#666666'
const gainPointColorPlayer_1 = 'yellow'
const gainPointColorPlayer_2 = 'purple'
const timeForColorsToChangeBack = 500
const cells = document.getElementsByClassName('cell')


const game_title = 'Game'
let intervalOfLiveTime;

function Main(props) {
    const array2d = props.gameRelated.array2d
    const setArray2d = props.gameRelated.setArray2d

    const size = props.gameRelated.size
    const setSize = props.gameRelated.setSize

    const isFirstToStart_Turn = props.gameRelated.isFirstToStart_Turn
    const set_IsFirstToStart_Turn = props.gameRelated.set_IsFirstToStart_Turn

    const gameType = props.gameRelated.gameType
    const setGameType = props.gameRelated.setGameType

    const player1 = props.gameRelated.player1
    const player2 = props.gameRelated.player2
    const setPlayer1 = props.gameRelated.setPlayer1
    const setPlayer2 = props.gameRelated.setPlayer2

    const gameResult_games = props.gameRelated.gameResult_games
    const set_gameResult_games = props.gameRelated.set_gameResult_games

    const set_upload_download_gainedPointsIndexes4sides = props.gameRelated.set_upload_download_gainedPointsIndexes4sides 
    
    const finished = props.gameRelated.finished  //la database ba isFinished halm grtua
    const setFinished = props.gameRelated.setFinished

    const indexOfNewPoints = props.gameRelated.indexOfNewPoints     //visual
    const setIndexOfNewPoints = props.gameRelated.setIndexOfNewPoints

    
    const Player = props.Player

    const calculate = props.calculate   //function
    const resetCalculation = props.resetCalculation   //function
    const computerThinkingMove = props.computerThinkingMove //function
    const notTaken = props.notTaken //function
    


    const [continueOrSetUp_continue_setup_game_loading, set_continueOrSetUp_continue_setup_game_loading] = useState('continue_or_setup')
    const [setup_options_computer_player, set_setup_options_computer_player] = useState('player_or_computer')
    
    const [ reRender , set_reRender] = useState('')
    const [setup_computer_difficulty, set_setup_computer_difficulty ] = useState('Beta')

    const [gainedXp, set_gainedXp] = useState(0)
 
    const [time, setTime] = useState(null)
    const [isInGame, set_isInGame] = useState(false)//la regai ama azanre la yariyayin yan na// ba gorani useEffectek run abe
    // set_isInGame(false) >> ''setup_newGame_while_inGAme'' u ''surrender'' u ''checkIfFinished''
    // set_isInGame(true) >> ''continueCurrentGame'' u ''createBoardForSetUpGame''
    
    const [isIn_continueOrSetup, set_isIn_continueOrSetup] = useState(true)
    // set_isIn_continueOrSetup(true)  >> ''show_goBack('continue_or_setup')''
    // set_isIn_continueOrSetup(false) >> ''continueCurrentGame''  u ''show_SetUpNewGame''

    const [gameResult_text, set_gameResult_text] = useState('')

    const [showMessage, set_showMessage] = useState(false)

    const [currentGameDetails, set_currentGameDetails] = useState('loading') //boya nulll be ka agar yakam yari be awa la xwaro aw null a bakar ahenino

    
    //////
    const [settingUp_name_p1, set_settingUp_name_p1] = useState('')  //la show_SetUpNewGame set akre bo user.displayName amash bo awai ka sarata user null a hich ru nayat//har 4 i bo setup new game ''onChange'' 
    const [settingUp_symbol_p1, set_settingUp_symbol_p1] = useState('X')
    const [settingUp_color_p1, set_settingUp_color_p1] = useState('#0e9fc4')

    const [settingUp_name_p2, set_settingUp_name_p2] = useState('Player2')  //har 4 i bo setup new game ''onChange''
    const [settingUp_symbol_p2, set_settingUp_symbol_p2] = useState('O')
    const [settingUp_color_p2, set_settingUp_color_p2] = useState('#e77f1d')

    const [settingUp_isFirstToStart_p1, set_settingUp_isFirstToStart_p1] = useState(true)
    const [settingUp_isFirstToStart_p2, set_settingUp_isFirstToStart_p2] = useState(false)
    //////

    useEffect(() => {

        return () => { 
            set_continueOrSetUp_continue_setup_game_loading('continue_or_setup')
            set_isInGame(false)
        }   
        // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [])

    useEffect(  ()=> { 

        //hata gorankari la state aka ru nayat run nabe wa ka rushi ya ba peyi gorankaryaka awai bmanawet run i akain
        //mabastaka lamaya >> ka ema state aka agorin awa re-render ek ru aya u la kati re-render aka code akai dyariman krdua run abe
        // awash boya dwai re-rendrer run yan akain chunka lawanaya pesh re render setSate man krd be u law kataya na akra yaksar code akan ish pe kian chunka ishta set state aka jebaje nabwa
        if(reRender === 'createArray2d' || reRender === 'createArray2d-again'){
            createArray2d()
        }else if(reRender === 'createCells_From_size'){ 
            createCells_From_size() 
        //set_reRender('')  //agar wa bkre awa board'aka tek ayat bawai ka  'createCells_From_size()' run nabe wa nashzanm bo ka bo 'createArray2d()' keshai nya u aika 
        //  >> boya la kotai method'akan dubara daskari akamo. hich sideEffect ekm bo nabwa bas nawaku la dahatu wa hsab kam re-render aka amaya ''  bas la rasta shteki ka be
        }else if(reRender === 'updateStuffAfterGameFinishes'){
            updateStuffAfterGameFinishes()
        }
      
 // eslint-disable-next-line react-hooks/exhaustive-deps
    },[reRender])

    useEffect(() => {//bama computer agar sarai be move aka
        //ka player choose i krd u sara gora awa ama trigger abe, wa kate computer choose aka dubara trigger abe 
        if(gameType === 'computer'){
            if(!(isFirstToStart_Turn === player1.isFirstToStart)){  
                setTimeout( ()=>{ computerMove() }, 200)
                
            }//ka surrender akre yan yari kotai yat awa set_IsFirstToStart_Turn('resetting so computer turn's useEffect updates) akre 
        }//bo awai ka player surrender i krd turn aka true abe u dwaish ka boardaka drust kra har true akreto u chunka peshtr true bua awa state nagore u am useEffect a run na abu
        
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isFirstToStart_Turn])

    useEffect(() => {//time while not in game
        if(isIn_continueOrSetup === true && props.user !==null && props.user !== 'notNull'){
            getcurrentGameDetails(); 
            getTime()
        }
        return () => {   clearInterval(intervalOfLiveTime)    }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isIn_continueOrSetup])

    useEffect(() => {//time while in game
        if(isInGame === true){ //time game took
            if(isInGame === true && finished ===  true){
                firebase.database().ref(`users/${props.user.uid}/currentGame/gameStatus`).once('value').then((snap) => {
                    if(snap.exists()){
                        let gameStatus = snap.val()
                        let ms = gameStatus.finishedAt - gameStatus.startedAt
                        const [days, hours, minutes , seconds] = msToRealTime(ms)
                        let time = `${days} ${hours} ${minutes} ${seconds}`
                        if(time.indexOf('-1') === -1){//-1 days eki tya abe agar yariyaka xera tawaw bet u timer aka natwanet bcheta 1 second o
                            setTime(time)
                        }
                    }else{    }
                }, error => {        })//lack of permission getting started time: (view)     
            }else{
                getTime()
            } 
        }
        return () => {     clearInterval(intervalOfLiveTime)    }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInGame])


    function showStateOnDom(id, display, innerHTML, style){
        document.getElementById(id).style.display = display
        document.getElementById(id).innerHTML = innerHTML
        document.getElementById(id).style.color = style
    }


    function createCells_From_size(){    
        set_IsFirstToStart_Turn( true )
        const cellContainer = document.getElementById('cell-container')
        cellContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        cellContainer.style.gridTemplateRows = `repeat(${size}, 1fr)`;
        for (let i = 0; i < size*size; i++) {
            cells[ i ].style.backgroundColor = originalColor
        }
    
        set_reRender('')
    }
    function getTime(){ //am function'a 3ayadi aw time aya ka lakati yariya dar akawe
        if(props.user !==null && props.user !== 'notNull'){
            firebase.database().ref(`users/${props.user.uid}/currentGame/gameStatus/startedAt`).once('value').then((snap) => {
                if(snap.exists()){
                    let ms = snap.val()  
                    ms = ms === null ? 0 : Date.now() - ms //firebase.firestore.FieldValue.serverTimestamp() shtek aneret bo server inja lawe kataka war agire so bas bo krdnawa naw database 'a
                    let days, hours, minutes, seconds  //Date.now()  kati local war agre
                    intervalOfLiveTime = setInterval( () => {
                        [days, hours, minutes , seconds] = msToRealTime(ms)
                        let time = `${days} ${hours} ${minutes} ${seconds}`
                        if(time.indexOf('-1') === -1){//-1 days eki tya abe agar yariyaka xera tawaw bet u timer aka natwanet bcheta 1 second o
                            setTime(time)
                        }
                        ms= ms+1000;
                    }, 1000)
                }else{    }       
            }, error => {    
                //  console.log('lack of permission getting started time: ',error)    
        })  
        }
    }

    /*
        function createArray2d(){

        if(continueOrSetUp_continue_setup_game_loading  !== 'continue'){ //seUp 
            let tempArray2d = [], tempArray = [], m = 0;   
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {    tempArray.push(m++)    }
                tempArray2d.push(tempArray)  
                tempArray= []
            }
            setArray2d(tempArray2d) 
            
            const updates = {};  
            updates['array2d'] = tempArray2d;  
            updates['player1'] = player1; 
            updates['player2'] = player2; 
            updates['gameSettings/size'] = size; 
            updates['gameSettings/gameType'] = gameType; 
            updates['gameStatus/startedAt'] = firebase.database.ServerValue.TIMESTAMP; 
            updates['gameStatus/isFinished'] = false
            updates['gameStatus/isFirstToStart_Turn'] = isFirstToStart_Turn; //ka true'a har daima
            if(gameType === 'computer'){     
                updates['gameStatus/gainedXp'] = gainedXp
            }
            firebase.database().ref(`users/${props.user.uid}/currentGame/`).update(updates);   
            //firebase.database().ref(`users/${props.user.uid}/currentGame/`).update({    player1: player1    });  bam shewayash yak yak akre  //bas bo update a ithink nak create/update


            //resetting everything(*)
            set_gameResult_won_lost_draw('')
            setFinished(false)
            setSize(size) 
            set_IsFirstToStart_Turn(true)  // bo awai la board'a tazaka firtToStart'aka har sarata dast pe kat 
            resetCalculation(player1, player2)
            //(*)

            set_reRender('createCells_From_size')
            

        }else if(continueOrSetUp_continue_setup_game_loading  === 'continue'){  //continueCurrentGame


            const cellContainer = document.getElementById('cell-container')
                cellContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
                cellContainer.style.gridTemplateRows = `repeat(${size}, 1fr)`;
            
     
            for (let i = 0; i < size; i++) {  // createCells_From_array2d
                for (let j = 0; j < size; j++) {
                    if(array2d[i][j] === player1.symbol ){
                        cells[ (size*i)+j ].style.backgroundColor = player1.color
                    }else if(array2d[i][j] === player2.symbol ){
                        cells[ (size*i)+j ].style.backgroundColor = player2.color
                    }else{
                        cells[ (size*i)+j ].style.backgroundColor = originalColor
                    }
                }
            }
            set_reRender('')//agar continue bube awa lera re-render akreto ba '', u agar setup new game bube awa la 'createCells_From_size' akreto ba '' //  harchan sideEffect nabwa ba nakrdni ama
        }
    }
    */
    function createArray2d(){

        if(continueOrSetUp_continue_setup_game_loading  === 'game'){ //seUp 


            let tempArray2d = [], tempArray = [], m = 0;   
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {    tempArray.push(m++)    }
                tempArray2d.push(tempArray)  
                tempArray= []
            }
            setArray2d(tempArray2d) 
            
            const updates = {};  
            updates['array2d'] = tempArray2d;  
            updates['player1'] = player1; 
            updates['player2'] = player2; 
            updates['gameSettings/size'] = size; 
            updates['gameSettings/gameType'] = gameType; 
            updates['gameStatus/startedAt'] = firebase.database.ServerValue.TIMESTAMP; 
            updates['gameStatus/isFinished'] = false
            updates['gameStatus/isFirstToStart_Turn'] = true; //ka true'a har daima
            if(gameType === 'computer'){     
                updates['gameStatus/gainedXp'] = gainedXp
            }
            firebase.database().ref(`users/${props.user.uid}/currentGame/`).update(updates);   
            //firebase.database().ref(`users/${props.user.uid}/currentGame/`).update({    player1: player1    });  bam shewayash yak yak akre  //bas bo update a ithink nak create/update


            //resetting everything(*)
            set_gameResult_games('')
            setFinished(false)
            setSize(size) 
            set_IsFirstToStart_Turn(true)  // bo awai la board'a tazaka firtToStart'aka har sarata dast pe kat 
            resetCalculation(player1, player2)
            //(*)

            set_reRender('createCells_From_size')
            

        }else if(continueOrSetUp_continue_setup_game_loading  === 'continue'){  //continueCurrentGame


            const cellContainer = document.getElementById('cell-container')
                cellContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
                cellContainer.style.gridTemplateRows = `repeat(${size}, 1fr)`;
            
     
            for (let i = 0; i < size; i++) {  // createCells_From_array2d
                for (let j = 0; j < size; j++) {
                    if(array2d[i][j] === player1.symbol ){
                        cells[ (size*i)+j ].style.backgroundColor = player1.color
                    }else if(array2d[i][j] === player2.symbol ){
                        cells[ (size*i)+j ].style.backgroundColor = player2.color
                    }else{
                        cells[ (size*i)+j ].style.backgroundColor = originalColor
                    }
                }
            }
            set_reRender('')//agar continue bube awa lera re-render akreto ba '', u agar setup new game bube awa la 'createCells_From_size' akreto ba '' //  harchan sideEffect nabwa ba nakrdni ama
        }
    }


    function changeColorWhenGainPoint(player){

        let beforeChangeColor = player.color
        let gainPointColor = isFirstToStart_Turn === player1.isFirstToStart ? gainPointColorPlayer_1: gainPointColorPlayer_2
        let className = isFirstToStart_Turn === player1.isFirstToStart ? 'player1_scores_point' : 'player2_scores_point'
        for (let i = 0; i < indexOfNewPoints.length; i++) {
            for (let j = 0; j < indexOfNewPoints[i].length; j++) {

                cells[indexOfNewPoints[i][j]].style.backgroundColor = gainPointColor
                cells[indexOfNewPoints[i][j]].classList.add(className)
                setTimeout( ()=>{
                    cells[indexOfNewPoints[i][j]].classList.remove(className)
                    cells[indexOfNewPoints[i][j]].style.backgroundColor = beforeChangeColor
                }, timeForColorsToChangeBack )
            }  
        }
        setIndexOfNewPoints([])
    }
    function choose(i, j){
     
        if(notTaken(i, j) === true){
 
            if(finished === false && (player1.gameResult === 'playing' && player2.gameResult === 'playing') ){   
                const cell = cells[ (i*size)+j ]
                let pointsBefore, pointsAfter
                if(isFirstToStart_Turn === player1.isFirstToStart){
                    cell.style.backgroundColor = player1.color
                    array2d[i][j] = player1.symbol
                    firebase.database().ref(`users/${props.user.uid}/currentGame/array2d/${i}/${j}/`).set(player1.symbol)
                    pointsBefore = player1.points
                    player1.points = calculate(player1)//indexOfNewPoints update abeto
                    pointsAfter = player1.points
                    if(gameType === 'computer' && pointsAfter-pointsBefore > 0){    calculate_xp(pointsAfter-pointsBefore)    }
                    changeColorWhenGainPoint(player1)
                }else{
                    cell.style.backgroundColor = player2.color
                    array2d[i][j] = player2.symbol
                    firebase.database().ref(`users/${props.user.uid}/currentGame/array2d/${i}/${j}/`).set(player2.symbol)
                    player2.points = calculate(player2)//indexOfNewPoints update boto
                    pointsAfter = player1.points
                    changeColorWhenGainPoint(player2)
                }
       
                const updates = {};  
                let player1_points = player1.points === 0 ? 'no points' : player1.points === 1 ? '1 point' : `${player1.points} points` ;
                let player2_points = player2.points === 0 ? 'no points' : player2.points === 1 ? '1 point' : `${player2.points} points` ;
                updates['gameStatus/gameResult_text'] = `${player1.name}[${player1.symbol}] has ${player1_points} against ${player2.name}[${player2.symbol}] who has ${player2_points}.`; //pewist naka set_gameResult_text() bkret 
                updates['gameStatus/isFirstToStart_Turn'] = !isFirstToStart_Turn; 
                updates['player1/points'] = player1.points; 
                updates['player2/points'] = player2.points; 
                firebase.database().ref(`users/${props.user.uid}/currentGame/`).update(updates);  

                set_IsFirstToStart_Turn(prev =>  !prev ) 
 
                checkIfFinished()// bo gameType'i 'player' u 'computer' ish run abe// gorani turn useEffecti turn trigger aka u lawesh state finished gorawa chunka ema lera bangman krdua
            }
        }    
    }
    function calculate_xp(newPoints){ //array of new points
        let numberOfCells=0, newTotalGainedXp
        for(let i=0; i<indexOfNewPoints.length; i++){
            numberOfCells += indexOfNewPoints[i].length
        }
        newTotalGainedXp = (numberOfCells*newPoints)+ gainedXp
        set_gainedXp(newTotalGainedXp) //set_gainedXp( (prevGainedXp) => (numberOfCells*newPoints)+prevGainedXp );  

        firebase.database().ref(`users/${props.user.uid}/currentGame/gameStatus`).update({ gainedXp: newTotalGainedXp});   
    }
    function computerMove(){
        if(!(isFirstToStart_Turn === player1.isFirstToStart) && finished===false){ //bo awaya agar ba button computerMove kra
            let array = computerThinkingMove() 
            choose( array[0], array[1]  ); 
        }
    }
    function checkIfFinished(){  //am shewaza xallata bikam ba symbol array check ka ba inspec element tek adre

        let temp;
        for (let i = 0; i < array2d.length; i++) {
            for (let j = 0; j < array2d.length; j++) {
                temp = array2d[i][j]
                if ( typeof temp === 'number' && isFinite(temp) ){ 
                    return;
                }
             }
        }
        firebase.database().ref(`users/${props.user.uid}/currentGame/gameStatus/`).update(  {isFinished:true})//pewist naka sync be//mergre:true bas bo firestore haya i think
        setFinished(true)
        set_isInGame(false)
        decideGameResult_andUpdateFirebase()
        set_reRender('updateStuffAfterGameFinishes')

        set_IsFirstToStart_Turn('resetting so computer turn\'s useEffect updates')//zanyari lasar awai bo wa akre la useEffect i 'IsFirstToStart_Turn' aya
    }


    function decideGameResult_andUpdateFirebase(){
        let temp_gameResult_text, temp_gameResult_text_firebase
        let player1_points = player1.points === 0 ? 'no points' : player1.points === 1 ? '1 point' : `${player1.points} points` ;
        let player2_points = player2.points === 0 ? 'no points' : player2.points === 1 ? '1 point' : `${player2.points} points` ;

        if(player1.points > player2.points){
            set_gameResult_games('gamesWon')
            player1.gameResult = 'won'
            player2.gameResult = 'lost'
            temp_gameResult_text = `${player1.name}[${player1.symbol}] with ${player1_points}, won against ${player2.name}[${player2.symbol}] who had ${player2_points}.`
            temp_gameResult_text_firebase = `${player1.name}[${player1.symbol}] ${player1_points} won against ${player2.name}[${player2.symbol}] ${player2_points}.`
        }else if(player1.points < player2.points){
            set_gameResult_games('gamesLost')
            player1.gameResult = 'lost'
            player2.gameResult = 'won'
            temp_gameResult_text = `${player2.name}[${player2.symbol}] with ${player2_points}, won against ${player1.name}[${player1.symbol}] who had ${player1_points}.`
            temp_gameResult_text_firebase = `${player2.name}[${player2.symbol}] ${player2_points} won against ${player1.name}[${player1.symbol}] ${player1_points}.`
        }else{
            set_gameResult_games('gamesDraw')
            player1.gameResult = 'draw'
            player2.gameResult = 'draw'
            temp_gameResult_text = `Draw, both ${player1.name}[${player1.symbol}] and ${player2.name}[${player2.symbol}] had ${player1_points}.`
            temp_gameResult_text_firebase = `Draw, both ${player1.name}[${player1.symbol}] and ${player2.name}[${player2.symbol}] had ${player1_points}.`
        }
        set_gameResult_text( temp_gameResult_text )

        let updates = {}
        updates['gameStatus/gameResult_text'] = temp_gameResult_text_firebase; 
        updates['player1'] = player1
        updates['player2'] = player2
        firebase.database().ref(`users/${props.user.uid}/currentGame/`).update(updates)
    }


    function msToRealTime(ms){
        let seconds= Math.floor((ms / 1000) % 60)
        let minutes = Math.floor((ms / (1000 * 60)) % 60)
        let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
        let days = Math.floor(ms / (1000 * 60 * 60 * 24))  //kesha nabe bo am saru 365(sallish be)

        let seconds_String = seconds === 0 ? '' : seconds === 1 ? `${seconds} second` : `${seconds} seconds`
        let minutes_String = minutes === 0 ? '' : minutes === 1 ? `${minutes} minute` : `${minutes} minutes`
        let hours_String = hours === 0 ? '' : hours === 1 ? `${hours} hour` : `${hours} hours`
        let days_String = days === 0 ? '' : days === 1 ? `${days} day` : `${days} days`

        return  [days_String, hours_String, minutes_String , seconds_String]
    }
    function addByOne_to_realTimeDatabase(gameType, gameResult){
        const ref = firebase.database().ref(`users/${props.user.uid}/`)
        ref.once('value').then( (snap) =>{
            let object = snap.val(), numberObject = object.gameResults || {} 

            if(numberObject.all === undefined ){    numberObject.all =  1     }
            else{                                      object.gameResults.all =  object.gameResults.all + 1    }
            if(numberObject[gameType] === undefined){
                numberObject[gameType] = {}
                numberObject[gameType].all =  1 
                numberObject[gameType][gameResult] =  1 
            }else{
                object.gameResults[gameType].all =  object.gameResults[gameType].all + 1
                object.gameResults[gameType][gameResult] =  object.gameResults[gameType][gameResult] === undefined ? 1 : object.gameResults[gameType][gameResult] + 1 //boya undefined chunka ishta property aka drust nakrawa
            }
            firebase.database().ref(`users/${props.user.uid}/gameResults`).update(numberObject)
        })
        //Most efficient way to increment a value of everything in Firebase    >>  https://stackoverflow.com/questions/34458930/most-efficient-way-to-increment-a-value-of-everything-in-firebase
    }


    async function updateXp_levelUp(){
        let bonus_gainedXp_gameResult = 0, total_gainedXp

        let userInfoObject = await firebase.database().ref(`users/${props.user.uid}/userInfo`).once('value').then( (snapshot) => snapshot.val()  )
        let level = userInfoObject.level || 0
        
        // if(set_setup_computer_difficulty === 'Beta'){     bonus_gainedXp_difficulty *= 1     }// variable ki taza bo difficult bonus xp
        if(gameResult_games === 'gamesWon'){                    bonus_gainedXp_gameResult += 5     }
        if(gameResult_games === 'gamesDraw'){                    bonus_gainedXp_gameResult += 3     }
        let temp_levelBonus_gainedXp = parseInt(((bonus_gainedXp_gameResult+gainedXp)*(level/5)).toFixed(2)) //toFixed round i aka ta 2 point ameneto, wa float akash la string o aika ba float u sfr'a trailing akan asreto

        total_gainedXp = gainedXp + bonus_gainedXp_gameResult + temp_levelBonus_gainedXp
        set_gainedXp( total_gainedXp )

        //userInfoObject 
        let xp = userInfoObject.xp || 0, xpNeededToLevelUp = userInfoObject.xpNeededToLevelUp
        let currentTotalXp = xp + gainedXp + bonus_gainedXp_gameResult + temp_levelBonus_gainedXp

        for( ; currentTotalXp > xpNeededToLevelUp ; ){
            level++
            currentTotalXp -= xpNeededToLevelUp
            xpNeededToLevelUp *= 1.5
        }
        if(level !== userInfoObject.level){
            let updates = {}
            updates['level'] = level
            updates['xp'] = parseInt(currentTotalXp)
            updates['xpNeededToLevelUp'] = parseInt(xpNeededToLevelUp)

            firebase.database().ref(`users/${props.user.uid}/userInfo/`).update(updates)
        }else{
            firebase.database().ref(`users/${props.user.uid}/userInfo/`).update({ xp: parseInt(currentTotalXp) })
        }// 
        ////

        // showStateOnDom('g-message-1', 'block' , gameResult_text, gameType === 'player' ? 'black' : player1.gameResult === 'won' ? 'green' : player1.gameResult === 'draw' ? 'yellow' : 'red')
        
        // showStateOnDom('g-message-2-div', 'block')
        if(total_gainedXp === 0){
            showStateOnDom('g-message-2-div-1', 'block' , `No XP gained`)
            showStateOnDom('g-message-2-div-2', 'block' , ``)
            showStateOnDom('g-message-2-div-3', 'block' , ``)
            showStateOnDom('g-message-2-div-4', 'block' , ``)
        }else{
            showStateOnDom('g-message-2-div-1', 'block' , `Total gained XP from scoring: ${gainedXp}`)
            showStateOnDom('g-message-2-div-2', 'block' , `Bonus gained XP from game result: ${bonus_gainedXp_gameResult}`)
            showStateOnDom('g-message-2-div-3', 'block' , `Bonus gained XP from level: ${temp_levelBonus_gainedXp}`)
            showStateOnDom('g-message-2-div-4', 'block' , `Total gained XP: ${total_gainedXp}`)
        }

        ////
        return total_gainedXp
    }
    async function updateStuffAfterGameFinishes(){ 
        set_reRender('')//chunka la regia useEffecti rerender eraman run krd

        let startedTime, finishedTime = firebase.database.ServerValue.TIMESTAMP //tiemstamp hich value i nya ka anerdre bo server lawe ms akai pe adre// boya abe bnerdre// inja dwai wari grino
        await firebase.database().ref(`users/${props.user.uid}/currentGame/gameStatus/finishedAt`).set(finishedTime)
        startedTime = await firebase.database().ref(`users/${props.user.uid}/currentGame/gameStatus/startedAt`).once('value').then( (snapshot) =>  new Date(snapshot.val())   )
        finishedTime = await firebase.database().ref(`users/${props.user.uid}/currentGame/gameStatus/finishedAt`).once('value').then( (snapshot) =>  new Date(snapshot.val())   )
        
        let timeTheGameTook = finishedTime.getTime() - startedTime.getTime() 
        const gameType_text = gameType === 'player' ? 'playerVsPlayer' : 'playerVsComputer'    
        const date_text = startedTime.toDateString() +' '+ startedTime.toLocaleTimeString()
        
        addByOne_to_realTimeDatabase(gameType_text, gameResult_games)

        //        const currentGameRef = firebase.firestore().collection('users').doc(props.user.uid).collection('games').doc(gameType_text).collection(gameResult_games).doc(date_text)
        const currentGameRef = firebase.firestore().collection('users').doc(props.user.uid).collection('games').doc(date_text)
        const arrayAsObject = Object.assign({}, array2d); 

        const batch = firebase.firestore().batch();
        batch.set(currentGameRef, {doc_id: date_text}); //doc_id nawi doc'akaya
        batch.set(currentGameRef, {array2d: arrayAsObject},{merge:true});
        batch.set(currentGameRef, {size: size},{merge:true});
        batch.set(currentGameRef, {gameType: gameType_text},{merge:true});
        batch.set(currentGameRef, {gameResult: gameResult_games},{merge:true});

        set_showMessage(true)
        showStateOnDom('g-message-1', 'block' , gameResult_text, gameType === 'player' ? 'black' : player1.gameResult === 'won' ? 'green' : player1.gameResult === 'draw' ? 'yellow' : 'red')
        if(gameType === 'player'){
            showStateOnDom('g-message-2-div', 'none')
        }
        //xp/level
        if(gameType === 'computer'){
            let total_gainedXp = await updateXp_levelUp()
            batch.set(currentGameRef, {gainedXp: total_gainedXp},{merge:true});    
        }
         //xp/level
        const player1_obj = Object.assign({}, player1);  
        batch.set(currentGameRef, {player1: player1_obj},{merge:true});     
        const player2_obj = Object.assign({}, player2);  
        batch.set(currentGameRef, {player2: player2_obj },{merge:true});

        batch.set(currentGameRef, {startedAt: startedTime.getTime()},{merge:true});
        batch.set(currentGameRef, {finishedAt: finishedTime.getTime()},{merge:true});
        batch.set(currentGameRef, {timeTheGameTook: timeTheGameTook},{merge:true});
        if(time.indexOf('-1') === -1){//-1 days eki tya abe agar yariyaka xera tawaw bet u timer aka natwanet bcheta 1 second o
            batch.set(currentGameRef, {timeTheGameTook_text: time},{merge:true});
        }else{
            batch.set(currentGameRef, {timeTheGameTook_text: '1 second'},{merge:true});
        }
        
    
        batch.commit().then(  () => {
            
        });
    }

    
    function getcurrentGameDetails(){
 
        firebase.database().ref(`users/${props.user.uid}/currentGame`).once('value').then( (snapshot) => {   
            if(snapshot.exists()){
                let currentGameDetails_Temp = snapshot.val()

                const currentTime = new Date().getTime()
                const [days, hours, minutes , seconds] = msToRealTime(currentTime - currentGameDetails_Temp.gameStatus.startedTime)
                currentGameDetails_Temp.timeSinceCurrentGame = `${days} ${hours} ${minutes} ${seconds}`

                set_currentGameDetails(currentGameDetails_Temp)
            }else{      set_currentGameDetails(null)    }   // console.log('Player hasn\'t played before')  
        }, error => {        })// lack of permission getting current game informations:      
    }
    function continueCurrentGame() {
        if(gameType === 'computer'){ set_gainedXp(currentGameDetails.gainedXp) }
        
        set_isIn_continueOrSetup(false)
        set_isInGame(true)

        setFinished(currentGameDetails.gameStatus.isFinished)//gameStatus
        set_IsFirstToStart_Turn(currentGameDetails.gameStatus.isFirstToStart_Turn)//gameStatus
        set_gameResult_text(currentGameDetails.gameStatus.gameResult_text)

        setArray2d(currentGameDetails.array2d) 
  
        setGameType(currentGameDetails.gameSettings.gameType)//gameSettings
        setSize(currentGameDetails.gameSettings.size) //gameSettings

        setPlayer1( new Player(currentGameDetails.player1.name, currentGameDetails.player1.symbol, currentGameDetails.player1.color, currentGameDetails.player1.isFirstToStart, currentGameDetails.player1.gameResult) )
        setPlayer2( new Player(currentGameDetails.player2.name, currentGameDetails.player2.symbol, currentGameDetails.player2.color, currentGameDetails.player2.isFirstToStart, currentGameDetails.player2.gameResult) )

        set_reRender('createArray2d') //re-render and then createArray2d()
        set_continueOrSetUp_continue_setup_game_loading('continue')

        set_upload_download_gainedPointsIndexes4sides('download')
    }
    

    function setup_newGame_while_inGAme(){
        set_isInGame(false)
        set_continueOrSetUp_continue_setup_game_loading('setup')
        set_setup_options_computer_player('player_or_computer')
    }   
    function surrender(){
        setFinished(true)
        set_isInGame(false)
        
        const updates = {};  
        let temp_gameResult_text, temp_gameResult_text_firebase
        let player1_points = player1.points === 0 ? 'no points' : player1.points === 1 ? '1 point' : `${player1.points} points` ;
        let player2_points = player2.points === 0 ? 'no points' : player2.points === 1 ? '1 point' : `${player2.points} points` ;
        if(isFirstToStart_Turn === player1.isFirstToStart){
            player1.gameResult = 'surrendered'
            updates['player1/gameResult'] = 'surrendered'

            player2.gameResult = 'won_becauseOf_surender'
            updates['player2/gameResult'] = 'won_becauseOf_surender'

            temp_gameResult_text = `${player2.name}[${player2.symbol}] who had ${player2_points} won, because ${player1.name}[${player1.symbol}] surrendered while having ${player1_points}.`
            temp_gameResult_text_firebase = `${player2.name}[${player2.symbol}] ${player2_points} won, because ${player1.name}[${player1.symbol}] ${player1_points} surrendered.`
        }else{
            player2.gameResult = 'surrendered'
            updates['player2/gameResult'] = 'surrendered'
            
            player1.gameResult = 'won_becauseOf_surender'
            updates['player1/gameResult'] = 'won_becauseOf_surender'

            temp_gameResult_text = `${player1.name}[${player1.symbol}] who had ${player1_points} won, because ${player2.name}[${player2.symbol}] surrendered while having ${player2_points}.`
            temp_gameResult_text_firebase = `${player1.name}[${player1.symbol}] ${player1_points} won, because ${player2.name}[${player2.symbol}] ${player2_points} surrendered.`
        }
        set_gameResult_text( temp_gameResult_text )
        updates['gameStatus/gameResult_text'] = temp_gameResult_text_firebase; 

        updates['gameStatus/isFinished'] = true;
  

        firebase.database().ref(`users/${props.user.uid}/currentGame/`).update(updates); 

        ////
        set_showMessage(true)
        if(gameType === 'computer'){
            showStateOnDom('g-message-1', 'block' , temp_gameResult_text, 'red')
            showStateOnDom('g-message-2-div-1', 'block' , ``)
            showStateOnDom('g-message-2-div-2', 'block' , ``)
            showStateOnDom('g-message-2-div-3', 'block' , `Match history won't be stored when surrendering`)
            showStateOnDom('g-message-2-div-4', 'block' , `No XP will be gained when surrendering`)
        }else{
            showStateOnDom('g-message-1', 'block' , temp_gameResult_text)
            showStateOnDom('g-message-2-div', 'none')
        }

        set_IsFirstToStart_Turn('resetting so computer turn\'s useEffect updates')//zanyari lasar awai bo wa akre la useEffect i 'IsFirstToStart_Turn' aya
    }

    /*
    function createBoardForSetUpGame(){     
      

        setPlayer1( new Player(settingUp_name_p1, settingUp_symbol_p1, settingUp_color_p1, settingUp_isFirstToStart_p1, 'playing') )
        if(gameType === 'player'){
            setPlayer2( new Player(settingUp_name_p2, settingUp_symbol_p2, settingUp_color_p2, settingUp_isFirstToStart_p2, 'playing') )
        }else if(gameType === 'computer'){
            if(setup_computer_difficulty === 'Beta'){
                let computerSymbol, computerColor, computerIsFirstToStart;
                if(settingUp_symbol_p1 !== 'X'){    computerSymbol= 'X'     }
                else if(settingUp_symbol_p1 !== 'O'){    computerSymbol= 'O'    }
            
                if(settingUp_color_p1 !== '#f0380a'){    computerColor= '#f0380a'     }
                else if(settingUp_color_p1 !== '#f00aba'){    computerColor= '#f00aba'    }
           
                computerIsFirstToStart = settingUp_isFirstToStart_p1 === true ? false : true
       
                setPlayer2( new Player(setup_computer_difficulty, computerSymbol, computerColor, computerIsFirstToStart, 'playing') ) 
            }   
        }
   
        
        set_reRender('createArray2d') //re-render and then createArray2d()
                //set_IsFirstToStart_Turn( true ) lera nakre u la createCells_From_size() akre awash bo awai agar computer first be bawa re-render ru bat(la regai aw useEffect'ai ka dependency akai IsFirstToStart_Turn'a)
        set_continueOrSetUp_continue_setup_game_loading('game')
        set_upload_download_gainedPointsIndexes4sides('upload') //hamu datai 4 array halgrtni indexi xall badast henrawakan akato ba '[]' 
    }
    */
    function createBoardForSetUpGame(again=false){    // signek drust kam ka again a yan na //ba parameter

   

        if((settingUp_name_p1.length < 3 || settingUp_name_p2.length < 3) && again === false){
            set_showMessage(true)
            showStateOnDom('g-message-1', 'block' , 'Name: Name should be greater or equal to 3 characters', 'red')
            return;
        }
  
        if(again === true){
            setPlayer1( new Player(player1.name, player1.symbol, player1.color, player1.isFirstToStart, 'playing') )
            setPlayer2( new Player(player2.name, player2.symbol, player2.color, player2.isFirstToStart, 'playing') )
            set_reRender('createArray2d-again') 
  
        }else{
         
            setPlayer1( new Player(settingUp_name_p1, settingUp_symbol_p1, settingUp_color_p1, settingUp_isFirstToStart_p1, 'playing') )
            if(gameType === 'player'){
                setPlayer2( new Player(settingUp_name_p2, settingUp_symbol_p2, settingUp_color_p2, settingUp_isFirstToStart_p2, 'playing') )
            }else if(gameType === 'computer'){
                if(setup_computer_difficulty === 'Beta'){
                    let computerSymbol, computerColor, computerIsFirstToStart;
                    if(settingUp_symbol_p1 !== 'X'){    computerSymbol= 'X'     }
                    else if(settingUp_symbol_p1 !== 'O'){    computerSymbol= 'O'    }
                
                    if(settingUp_color_p1 !== '#f0380a'){    computerColor= '#f0380a'     }
                    else if(settingUp_color_p1 !== '#f00aba'){    computerColor= '#f00aba'    }
               
                    computerIsFirstToStart = settingUp_isFirstToStart_p1 === true ? false : true
           
                    setPlayer2( new Player(setup_computer_difficulty, computerSymbol, computerColor, computerIsFirstToStart, 'playing') ) 
                }   
            }
        }
       
        set_isInGame(true)
        setFinished(false)
        if(gameType === 'computer'){ set_gainedXp(0) }

        
        
         set_reRender('createArray2d') //re-render and then createArray2d()
                //set_IsFirstToStart_Turn( true ) lera nakre u la createCells_From_size() akre awash bo awai agar computer first be bawa re-render ru bat(la regai aw useEffect'ai ka dependency akai IsFirstToStart_Turn'a)
        set_continueOrSetUp_continue_setup_game_loading('game')
        set_upload_download_gainedPointsIndexes4sides('upload') //hamu datai 4 array halgrtni indexi xall badast henrawakan akato ba '[]' 

        setTime(null)
    }


    function show_SetUpNewGame(){
        setGameType('')
        set_continueOrSetUp_continue_setup_game_loading('setup');  
        set_isIn_continueOrSetup(false)
    }
    function show_playerVsPlayer(){
        setGameType('player')
        set_setup_options_computer_player('player')
        set_settingUp_name_p1(props.user.displayName)//boya leraya ka dwai yariyak agar dubara setUp bkreto awa bo awai ka player yan computer dyari akre aw kata dubara nawaka daneto
    }
    function show_playerVsComputer(){
        setGameType('computer')
        set_setup_options_computer_player('computer')
        set_settingUp_name_p1(props.user.displayName)
    }
    function show_goBack(path){
        if(path === 'player_or_computer'){
            set_setup_options_computer_player('player_or_computer')
        }if(path === 'continue_or_setup'){
            set_continueOrSetUp_continue_setup_game_loading('continue_or_setup')
            set_currentGameDetails('loading')
            set_isIn_continueOrSetup(true) 
        }
    }   
    

    function getInputSymbol_p1(e){ 
        const oneChar = e.target.value[e.target.value.length-1]     
        if(/\w/.test(oneChar) === true && (settingUp_symbol_p2 !== oneChar !== oneChar)){    set_settingUp_symbol_p1( oneChar );    }    
    }
    function getInputSymbol_p2(e){
        const oneChar = e.target.value[e.target.value.length-1]     
        if(/\w/.test(oneChar) === true && (settingUp_symbol_p1 !== oneChar !== oneChar)){    set_settingUp_symbol_p2( oneChar );    }    
    }
    function getInputName_p1(e){
        const name = e.target.value

        if(name.length > 9){     return;    }
        const regex = /\w/g 
        for(let i=0; i<name.length ; i++ )   {    if(regex.test(name ) === false){   return;    }      }

        if(gameType === 'player'){
            if( settingUp_name_p2 !== name ){    set_settingUp_name_p1( name );    }   
        }else if(gameType === 'computer'){
            if( setup_computer_difficulty !== name ){    set_settingUp_name_p1( name );    }   
        }
    }
    function getInputName_p2(e){
        const name = e.target.value
        if(name.length > 9){     return;    }

        if( settingUp_name_p1 !== name ){    set_settingUp_name_p2( name );    }    
    }
    function getFirstToStart_swap() {
        set_settingUp_isFirstToStart_p1(prev => !prev)  //swap
        set_settingUp_isFirstToStart_p2(prev => !prev)  //swap
    }
    function changeSize(doIncrease){
        if( doIncrease === true && size === 12 ){    return    }
        if( doIncrease === false && size === 3 ){    return    }

        if(doIncrease === true){
            setSize((prevN) => prevN+1)
        }else{
            setSize((prevN) => prevN-1)
        }
    }



    if(props.user === null){
        return (    <Redirect to='/'/>    )
    }else if(props.user === 'notNull' || continueOrSetUp_continue_setup_game_loading === 'loading'){
        return (<Loading  />)    
    }else if(continueOrSetUp_continue_setup_game_loading === 'continue_or_setup'){
        return(
            <div id='game-container'>
                <div id='title'>{game_title}</div>
          
                <div id='game-box'> 
                    {currentGameDetails !== 'loading' && currentGameDetails !== null ?  
                        <div id='currentGame'>
                            <button id='currentGame-continueCurrentGame-button' onClick={ continueCurrentGame } >{currentGameDetails.gameStatus.isFinished === true ? 'View Last Game' : 'Continue Previous Game' }</button>
                            <div id='currentGame-details'>
                                <div id='currentGame-details-result'>{currentGameDetails.gameStatus.isFinished === true ? 'Previous game was finished' : 'Previous game wasn\'t finished'}</div> 
                                <div id='currentGame-details-gameResult'>{currentGameDetails.gameStatus.gameResult_text} </div> 
                                <div className='currentGame-details-other'>game Type: {currentGameDetails.gameSettings.gameType === 'player' ? 'player Vs Player' : 'player Vs Computer'}</div> 
                                <div className='currentGame-details-other'>size: {currentGameDetails.gameSettings.size}</div> 
                                { currentGameDetails.gameSettings.gameType === 'player' ? '' : 
                                    <div className='currentGame-details-other'>Gained XP: { currentGameDetails.gameStatus.gainedXp}</div> 
                                }
                                <div className='currentGame-details-other'>
                                    turn: {currentGameDetails.gameStatus.isFirstToStart_Turn === currentGameDetails.player1.isFirstToStart ? `${currentGameDetails.player1.name}` : `${currentGameDetails.player2.name}` }
                                </div> 
                            
                                {time === null ? '' : <div id='currentGame-details-time'>{currentGameDetails.gameStatus.isFinished === true ? `Time passed after finishing previous game ${time}` : `Time passed since last play ${time}` }</div> }
                            </div>
                        </div>
                    : currentGameDetails === 'loading' ? <div id='g-message'>loading for current game details</div> : <div id='g-message'>Player hasn't played before</div>   }
                </div>
                 
                <button className='go-playerorComputer-button' onClick={show_SetUpNewGame} >Setup New Game</button>
            </div>
        )
    }else if(continueOrSetUp_continue_setup_game_loading === 'setup'){  
        if(setup_options_computer_player === 'player_or_computer'){
            return(
                <div id='game-container'>
                    <div id='title'>{game_title}</div>

                    <div id='game-box'>
                        <button className='go-playerorComputer-button' onClick={show_playerVsPlayer} >Player vs Player</button>
                        <button className='go-playerorComputer-button' onClick={show_playerVsComputer} >Player vs Computer</button>
                    </div>

                    <button id='goBack-button' onClick={() => show_goBack('continue_or_setup')} > go back</button>
                </div>
            )
        }else if(setup_options_computer_player === 'player'){
            return(
                <div id='game-container'>
                    <div id='title'>{game_title}</div>

                    
                    <div id='g-message'>
                        <input className='hide' id="g-message-check-button" type="checkbox" onChange={()=> set_showMessage(!showMessage)} checked={showMessage} />  
                        <label id='g-message-background' htmlFor='g-message-check-button'>
                            <div id='g-message-container'>
                                <div id='g-message-1'></div>
                                <div id='g-message-2'></div>
                            </div>
                        </label>
                    </div>

                    <form   onSubmit={e => { e.preventDefault(); createBoardForSetUpGame()}}  id='game-box'>  {/*bam shewaya onSubmit la formaka be inja required ish aka wa inputeki type i submit man habe*/}
                        
                        <div id='name-symbol-color'>
                            <div className='inputs-player'> 
                                <div className='name'>
                                    <label className='name-input-label' htmlFor="input-name">Name: </label>
                                    <input className='name-input' id="nput-name"  onChange={(e) => getInputName_p1(e) } value={settingUp_name_p1} type='text' required /> 
                                </div>
                                <div className='symbol-color'>
                                    <div className='symbol'>
                                        <label className='symbol-input-label' htmlFor="input-symbol">Symbol: </label>
                                        <input className='symbol-input' id="input-symbol"  onChange={(e) => getInputSymbol_p1(e) } value={settingUp_symbol_p1} type='text'   required />
                                    </div>     
                                    <div className='color'>
                                        <label className='color-input-label' htmlFor="color-input">Color:  </label>
                                        <input className='color-input' id="color-input"  type="color"  onChange={ (e) => set_settingUp_color_p1(e.target.value) } value={settingUp_color_p1} required />
                                    </div>
                                </div>
                            </div>
                            <div className='inputs-player'>
                                <div className='name'>
                                    <label className='name-input-label' htmlFor="input-name">Name: </label>
                                    <input className='name-input' id="nput-name" onChange={(e) => getInputName_p2(e) } value={settingUp_name_p2} type='text'  required />                                 
                                </div>
                                <div className='symbol-color'>
                                    <div className='symbol'>
                                        <label className='symbol-input-label' htmlFor="input-symbol">Symbol: </label>
                                        <input className='symbol-input' id="input-symbol" onChange={(e) => getInputSymbol_p2(e) } value={settingUp_symbol_p2} type='text'  required />
                                    </div>
                                    <div className='color'>
                                        <label className='color-input-label' htmlFor="color-input">Color:  </label>
                                        <input className='color-input' id="color-input" type="color" onChange={ (e) => set_settingUp_color_p2(e.target.value) } value={settingUp_color_p2} required />
                                    </div>
                                </div>
                            </div>
                        </div>

                       
                        <div id='turn'>
                            <div className='turn-player'>
                                <div className='turn-inBetween-text'>First to start</div>   
                                <div className='turn-text'>{ settingUp_isFirstToStart_p1 === true ? settingUp_name_p1 : settingUp_name_p2  }</div>  
                            </div>
                     
                            <button id='turn-button' onClick={ (e) =>{ e.preventDefault(); getFirstToStart_swap(e) }} ><FontAwesomeIcon icon={faExchangeAlt} /></button>    
                            <div className='turn-player'>
                                <div className='turn-inBetween-text'>Second to start</div>   
                                <div className='turn-text'>{ settingUp_isFirstToStart_p1 === true ? settingUp_name_p2 : settingUp_name_p1 }</div>   
                            </div>                                          
                        </div>
                        
                        <div id='size'>
                            <button className='size-button' onClick={(e) => { e.preventDefault(); changeSize(true);  }} ><FontAwesomeIcon icon={faChevronUp} /></button>
                            <div id='size-text'>{size}</div>
                            <button className='size-button' onClick={(e) => { e.preventDefault(); changeSize(false); }} ><FontAwesomeIcon icon={faChevronDown} /></button>
                        </div>
                       

                        <input  id="form-submit" type="submit" value='Create Board'/>  {/* value aka aw text aya ka la buttonaka anusre */}
                    </form>    

                    <button id='goBack-button' onClick={() => show_goBack('player_or_computer')} > go back</button>
                </div>
            )
        }else if(setup_options_computer_player === 'computer'){
            return(
                <div id='game-container'>
                    <div id='title'>{game_title}</div>

                    <div id='g-message'>
                        <input className='hide' id="g-message-check-button" type="checkbox" onChange={()=> set_showMessage(!showMessage)} checked={showMessage} />  
                        <label id='g-message-background' htmlFor='g-message-check-button'>
                            <div id='g-message-container'>
                                <div id='g-message-1'></div>
                                <div id='g-message-2'></div>
                            </div>
                        </label>
                    </div>  
                  
                     <form onSubmit={e => { e.preventDefault(); createBoardForSetUpGame()}}   id='game-box'>

                            <div className='inputs-player--computer'>{/* name-symbol-color nya */}
                                <div className='name'>
                                    <label className='name-input-label' htmlFor="input-name">Name: </label>
                                    <input className='name-input'  id="nput-name" onChange={(e) => getInputName_p1(e) } value={settingUp_name_p1} type='text'  required />
                                </div>
                                <div className='symbol-color'>
                                    <div className='symbol'>
                                        <label className='symbol-input-label' htmlFor="input-symbol">Symbol: </label>
                                        <input className='symbol-input'  id="input-symbol" onChange={(e) => getInputSymbol_p1(e) } value={settingUp_symbol_p1} type='text'  required />
                                    </div>
                                    <div className='color'>
                                        <label className='color-input-label' htmlFor="color-input">Color:  </label>
                                        <input className='color-input' id="color-input" type="color" onChange={ (e) => set_settingUp_color_p1(e.target.value) } value={settingUp_color_p1} required />
                                    </div>
                                </div>
                                
                            </div>
                    

                        <div id='difficulty'>
                            <div className='difficulty-div'>
                                <input className='input-radio' id="radio-difficulty-easy"  value="Beta" onChange={ (e) => set_setup_computer_difficulty(e.target.value) } type="radio"  name="radio-difficulty"  defaultChecked  />  
                                <label className='input-radio-label' htmlFor="radio-difficulty-easy">difficulty easy</label>
                            </div>
                            {/*  defaultChecked u   defaultChecked  haman sht akan  */} {/*  onChange boya bo radio bakar yat ka data i naw state akash haman awa be ka dyari krawa   */}
                            <div className='difficulty-div'>
                                <input className='input-radio'  id="radio-difficulty-medium" disabled value="Alpha"  onChange={ (e) => set_setup_computer_difficulty(e.target.value) }  type="radio" name="radio-difficulty" />
                                <label className='input-radio-label' htmlFor="radio-difficulty-medium">difficulty medium</label>
                            </div>
                        </div>
                        
          
                        <div id='turn'>     
                            <div className='turn-player'>
                                <div className='turn-inBetween-text'>First to start</div>   
                                <div className='turn-text'>{ settingUp_isFirstToStart_p1 === true  ? settingUp_name_p1 : setup_computer_difficulty }</div>  
                            </div>   
                            
                            <button id='turn-button' onClick={ (e) =>{ e.preventDefault(); getFirstToStart_swap(e) }} ><FontAwesomeIcon icon={faExchangeAlt} /></button>

                            <div className='turn-player'>
                                <div className='turn-inBetween-text'>Second to start</div>   
                                <div className='turn-text'>{ settingUp_isFirstToStart_p1 === true ? setup_computer_difficulty : settingUp_name_p1 }</div>   
                            </div>
                                               
                        </div>

                        <div id='size'>
                        <button className='size-button' onClick={(e) => { e.preventDefault(); changeSize(true);  }} ><FontAwesomeIcon icon={faChevronUp} /></button> 
                            <div id='size-text'>{size}</div>   
                            <button className='size-button' onClick={(e) => { e.preventDefault(); changeSize(false); }} ><FontAwesomeIcon icon={faChevronDown} /></button>
                        </div>
                     
                  
                        <input  id="form-submit" type="submit" value='Create Board'/>  
                            
                    </form>

                    <button id='goBack-button' onClick={() => show_goBack('player_or_computer')} >go back</button>
                </div>
            )
        }
           
    }else if(continueOrSetUp_continue_setup_game_loading === 'game' || continueOrSetUp_continue_setup_game_loading === 'continue' ){
        return(
            <div id='game-container'>

                <div id='game-container-container'>

                    <div id='title'>{game_title}</div>



               

                    <div id='g-message'>
                        <input className='hide' id="g-message-check-button" type="checkbox" onChange={()=> set_showMessage(!showMessage)} checked={showMessage} />  
                        <label id='g-message-background' htmlFor='g-message-check-button'>
                            <div id='g-message-container'>
                                <div id='g-message-1'></div>
                                <div id='g-message-2-div'>
                                    <div id='g-message-2-div-1'></div>
                                    <div id='g-message-2-div-2'></div>
                                    <div id='g-message-2-div-3'></div>
                                    <div id='g-message-2-div-4'></div>
                                </div>
                            </div>
                        </label>
                    </div>
                   
                    <div id='player-details'>
                        <div className='player-details-eachUser'>
                            <span className='player-details-name'>{player1.name}</span>
                            <div className='player-details-points-stuff'>
                                <span className='player-details-inBetweenText'>points: </span>
                                <span className='player-details-points'>{player1.points}</span>
                            </div>
                        </div>
                        <div className='player-details-eachUser'>
                            <span className='player-details-name'>{player2.name}</span>
                            <div className='player-details-points-stuff'>
                                <span className='player-details-inBetweenText'>Points: </span>
                                <span className='player-details-points'>{player2.points}</span>
                            </div>
                        </div>
                    </div>

                
                    <div id='cell-container'  >
                        {
                            array2d.map( (row, i) => (//i == rowIndex//j == columnIndex
                                row.map( (value, j) => (
                                    <button onClick={ () =>{ gameType ==='computer' && isFirstToStart_Turn !== player1.isFirstToStart? console.log('')  :  choose(i, j)   }}
                                    // wata tanha ka sarai player2 be && gameType computer be inja choose nakret
                                        className='cell' 
                                        key={(i*size)+j} 
                                        style={{backgroundColor : originalColor}} >
                                            {value}
                                    </button>
                            )  )
                            )  )
                        }
                    </div>

                    
                    
                    <div id='underBoard'>
                        <div id='underBoard-buttons'>
                            { finished === false ?  <button className='underBoard-button' onClick={ surrender }  >surrender</button>  : '' }
                            { finished === true ?   <button className='underBoard-button' onClick={ () => { createBoardForSetUpGame(true) } } >Again</button>  : '' }
                            { finished === true ?   <button className='underBoard-button' onClick={setup_newGame_while_inGAme}  >New Game</button>  : '' }
                        </div>
                        <div id='underBoard-details'> 
                            { gameType === 'player' ? '' :
                                <div id='underBoard-details-gainedXp'> 
                                    Gained XP: {gainedXp}
                                </div>
                            }
                            <div id='underBoard-details-time'> 
                                {time === null ? '' : `time: ${time}`}
                            </div>
                            <div id='underBoard-details-turn'>
                                {isFirstToStart_Turn ===  player1.isFirstToStart ? player1.name : '' }  
                                {isFirstToStart_Turn ===  player2.isFirstToStart ? player2.name : '' }
                                {finished === false ? <span id='underBoard-details-turn-inBetweenText'>'s turn</span> : '' }
                            </div>
                        </div>
                    </div>   


                 


                </div>   
            </div>
        )
    }
}

export default Main
