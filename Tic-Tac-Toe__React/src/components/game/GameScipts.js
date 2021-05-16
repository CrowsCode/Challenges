import React,{useState, useEffect} from 'react'
import GameJsx from './GameJsx.js'
import firebase from 'firebase/app'
import 'firebase/database';


class Player{
    constructor(userName, symbol, color, booleanFirstToStart, gameResult){
        this.points=0

        this.name = userName
        this.symbol=symbol
        this.color=color
        this.isFirstToStart = booleanFirstToStart

        this.gameResult = gameResult//playing-surrendered-won-lost-draw
    } 
}

//disable buttons for a few seconds after one click



/* LA HAR SHWENE PROMISE HABE BA THEN RESOLVE AKREEEE
var adaRef = firebase.database().ref('users/ada');
adaRef.remove()
  .then(function() {
    console.log("Remove succeeded.")
  })
  .catch(function(error) {
    console.log("Remove failed: " + error.message)
  });
*/

//var offsetVal = offset.val() || 0;  best stuff testi kam



let horizontal = []
let vertical = []
let diagonalRight = []
let diagonalLeft = []
function resetCalculation(player1, player2){
    player1.points = 0
    player2.points = 0

    horizontal = []
    vertical = []
    diagonalRight = []
    diagonalLeft = []
}


function GameScipts(props) {  //props.userr

    const [gameResult_games, set_gameResult_games] = useState('');

   
    const [finished, setFinished] = useState(false);

    const [size, setSize] = useState(3);
    const [isFirstToStart_Turn, set_IsFirstToStart_Turn] = useState('') //true === sarai fristToStart//daima yari taza ba isFirstToStart_Turn'i true dast pe aka bas lera '' dai anem ka lawe ka wtm true'a re-render ru bat 
    const [array2d, setArray2d] = useState([[]])
    const [indexOfNewPoints, setIndexOfNewPoints] = useState([])
    const [gameType, setGameType] = useState() //computer === player vs computer  //player === player vs player

    const [player1, setPlayer1] = useState('')
    const [player2, setPlayer2] = useState('')

    const [upload_or_download_gainedPointsIndexes4sides, set_upload_download_gainedPointsIndexes4sides] = useState('')


    const gameRelated = {
        size:size,
        setSize:setSize, 
        gameType:gameType,
        setGameType:setGameType,
        isFirstToStart_Turn:isFirstToStart_Turn, 
        set_IsFirstToStart_Turn:set_IsFirstToStart_Turn, 
        array2d: array2d,
        setArray2d: setArray2d,
        gameResult_games:gameResult_games,
        set_gameResult_games: set_gameResult_games,

        finished:finished, 
        setFinished:setFinished,

        indexOfNewPoints: indexOfNewPoints,
        setIndexOfNewPoints: setIndexOfNewPoints,  

        player1:player1,
        player2:player2,
        setPlayer1:setPlayer1,
        setPlayer2:setPlayer2,

        set_upload_download_gainedPointsIndexes4sides:set_upload_download_gainedPointsIndexes4sides,
    }
    

    useEffect(  () => {
        if(upload_or_download_gainedPointsIndexes4sides === 'upload'){  // la kotai 'calculation' sate aka abe bama

        const updates = {}
            updates['horizontal'] = horizontal; 
            updates['vertical'] = vertical; 
            updates['diagonalRight'] = diagonalRight; 
            updates['diagonalLeft'] = diagonalLeft; 
            firebase.database().ref(`users/${props.user.uid}/currentGame/gameStatus/gainedPointsIndexes4sides/`).update(updates); 

        }else if(upload_or_download_gainedPointsIndexes4sides === 'download'){  // ls 'continueLastGame' bang akre
            const download = async () => { 
            //abe bam sheway async lanaw useEffect bakar be ka agar arrow function akai useeffect async bwaya awa promise return abu la jegai cleanup function //https://www.robinwieruch.de/react-hooks-fetch-data
            const ref = firebase.database().ref(`users/${props.user.uid}/currentGame`).child(`gameStatus`).child(`gainedPointsIndexes4sides`)
            horizontal = await ref.child(`horizontal`).once('value').then( (snapshot) => {  return snapshot.val() === null ? [] : snapshot.val() } )
            vertical = await ref.child(`vertical`).once('value').then( (snapshot) =>     {  return snapshot.val() === null ? [] : snapshot.val() } )
            diagonalRight = await ref.child(`diagonalRight`).once('value').then( (snapshot) =>  {  return snapshot.val() === null ? [] : snapshot.val() } )
            diagonalLeft = await ref.child(`diagonalLeft`).once('value').then( (snapshot) =>    {  return snapshot.val() === null ? [] : snapshot.val() } )
          };
          download();
        }

        set_upload_download_gainedPointsIndexes4sides('')  //chunka har upload upload upload state update nabe u re-render nakre
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [upload_or_download_gainedPointsIndexes4sides])


    function calculate(player){
    
        const TempIndexOfNewPoints = indexOfNewPoints
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
               if(j+2<size   &&  array2d[i][j] === player.symbol && array2d[i][j+1] === player.symbol && array2d[i][j+2] === player.symbol){
                   if(    ! (horizontal.includes((i*size)+j)  ||  horizontal.includes((i*size)+j+1)  ||  horizontal.includes((i*size)+j+2))  )  {  //kawanai yakam katek pass abe ka value'i kasyan la horizontal'aka nabe 
                        horizontal.push((i*size)+j, (i*size)+j+1, (i*size)+j+2) 
                        player.points = player.points+1
                        TempIndexOfNewPoints.push( [ (i*size)+j, (i*size)+j+1, (i*size)+j+2 ] )
                        
                   }else if( ! (j-1 >=0 && array2d[i][j-1] === player.symbol) ){// bam shewaya agar 6 dana habn la panai yak awa bas am code'anai xwaro bo yakam dana la 6 dana ish akat
                       //bo nmuna 6 dana man haya X'size, 3 danayan(x) bam shewaya pointek paya akan X|2|x|x|x|X katek ka raqam 2 akain awa point zya nabe boya lam else a charasari awa akain
                       
                       let continuousTimes = 0, continuousTimesPastPoints = 0, tempArray = []
                       for (let x = j; x < size; x++) {                         
                          if( array2d[i][x] === player.symbol ){
                            continuousTimes++
                            if(horizontal.includes((i*size)+x) ){    continuousTimesPastPoints++    }else{    tempArray.push((i*size)+x)    } //ba hoi else akawa awai la array'aka nabe acheta tempArray
                          }else{
                              break;
                          }
                       }
                
                       if( continuousTimesPastPoints!==continuousTimes &&   continuousTimes%3===0   ){ // sarata ser akain agar equal bun awa wazi le ayanin// kate equal abe bo nmuna  X|X|x|x|x|X awa daima equal abet u hata am marja yat
                           // ba hoi saro ka continue abe agar yakam danai continus'ek nabe dllnyayin awai mamalai lagal akain yakam danaya, boya akre la yakam danawa la regai %3 bzanre ka point ayat yan na
                            horizontal.push(...tempArray)
                            TempIndexOfNewPoints.push( tempArray )
                            player.points = player.points+1
                       }
                   }
               } 
               if(i+2<size   &&  array2d[i][j] === player.symbol && array2d[i+1][j] === player.symbol && array2d[i+2][j] === player.symbol){
                    if( ! (vertical.includes((i*size)+j)  ||  vertical.includes(((i+1)*size)+j)  ||  vertical.includes(((i+2)*size)+j)) ){
                        vertical.push((i*size)+j, ((i+1)*size)+j, ((i+2)*size)+j) 
                        player.points = player.points+1
                        TempIndexOfNewPoints.push( [ (i*size)+j, ((i+1)*size)+j, ((i+2)*size)+j ] )
                    }else if( ! (i-1 >=0 && array2d[i-1][j] === player.symbol) ){
                      
                        let continuousTimes = 0, continuousTimesPastPoints = 0, tempArray = []
                        for (let y = i; y < size; y++) {                         
                           if( array2d[y][j] === player.symbol ){
                             continuousTimes++
                             if(vertical.includes((y*size)+j) ){    continuousTimesPastPoints++    }else{    tempArray.push((y*size)+j)    } 
                           }else{
                               break;
                           }
                        }

                        if( continuousTimesPastPoints!==continuousTimes  &&  continuousTimes%3===0   ){ 
                            vertical.push(...tempArray)
                             TempIndexOfNewPoints.push( tempArray )
                             player.points = player.points+1
                        }
                    }
                }
                if( ( i+2<size && j+2<size )  &&  array2d[i][j] === player.symbol && array2d[i+1][j+1] === player.symbol && array2d[i+2][j+2] === player.symbol){
                    if( ! (diagonalRight.includes((i*size)+j)  ||  diagonalRight.includes(((i+1)*size)+j+1)  ||  diagonalRight.includes(((i+2)*size)+j+2)) ){
                        diagonalRight.push((i*size)+j, ((i+1)*size)+j+1, ((i+2)*size)+j+2) 
                        player.points = player.points+1
                        TempIndexOfNewPoints.push( [ (i*size)+j, ((i+1)*size)+j+1, ((i+2)*size)+j+2 ] )
                    }else if( ! (i-1>=0 && j-1 >=0 &&  array2d[i-1][j-1] === player.symbol) ){
                        let continuousTimes = 0, continuousTimesPastPoints = 0, tempArray = []
                        for (let y = i, x = j; y<size && x<size;  y++, x++) {                        
                           if( array2d[y][x] === player.symbol ){
                             continuousTimes++
                             if(diagonalRight.includes((y*size)+x) ){    continuousTimesPastPoints++    }else{    tempArray.push((y*size)+x)    } 
                           }else{
                               break;
                           }
                        }
                        if( continuousTimesPastPoints!==continuousTimes  &&  continuousTimes%3===0   ){ 
                            diagonalRight.push(...tempArray)
                             TempIndexOfNewPoints.push( tempArray )
                             player.points = player.points+1
                        }
                    }
                }
                if( ( i+2<size && j-2>=0 )  &&  array2d[i][j] === player.symbol && array2d[i+1][j-1] === player.symbol && array2d[i+2][j-2] === player.symbol){
                    if( ! (diagonalLeft.includes((i*size)+j)  ||  diagonalLeft.includes(((i+1)*size)+j-1)  ||  diagonalLeft.includes(((i+2)*size)+j-2)) ){
                        diagonalLeft.push((i*size)+j, ((i+1)*size)+j-1, ((i+2)*size)+j-2) 
                        player.points = player.points+1
                        TempIndexOfNewPoints.push( [ (i*size)+j, ((i+1)*size)+j-1, ((i+2)*size)+j-2 ] )
                    }else if( ! (i-1>=0 && j+1 <size && array2d[i-1][j+1] === player.symbol) ){
                        let continuousTimes = 0, continuousTimesPastPoints = 0, tempArray = []
                        for (let y=i, x = j;  y<size && x>=0; y++, x--) {                   
                           if( array2d[y][x] === player.symbol ){
                             continuousTimes++
                             if(diagonalLeft.includes((y*size)+x) ){    continuousTimesPastPoints++    }else{    tempArray.push((y*size)+x)    } 
                           }else{
                               break;
                           }
                        }
                        if( continuousTimesPastPoints!==continuousTimes  &&  continuousTimes%3===0   ){ 
                            diagonalLeft.push(...tempArray)
                             TempIndexOfNewPoints.push( tempArray )
                             player.points = player.points+1
                        }
                    }
                }
            }
        } 

        set_upload_download_gainedPointsIndexes4sides('upload')

        setIndexOfNewPoints(TempIndexOfNewPoints)

        return player.points
    }

    function computerChoose(player, oppositePlayer){
        for (let i = 0; i < size ; i++) {
            for (let j = 0; j < size; j++) {
                if(  array2d[i][j] !== player.symbol  &&  array2d[i][j] !== oppositePlayer.symbol   ){//(1)marji yakam awaya ka aw cell'ala symbol akai yaksan nya ba hich player'kyan wata cholla
                    if( (j-1>=0 && j+1<size && array2d[i][j-1] === player.symbol && array2d[i][j+1] === player.symbol)  //(2)awaya ka lai chap u lai rasti ba symbol'i useraka giraw
                    ||  (j+2<size  && array2d[i][j+1] === player.symbol && array2d[i][j+2] === player.symbol) //(3)awai ka 2 danai bardami haman symbol be
                    ||  (j-2>=0  && array2d[i][j-1] === player.symbol && array2d[i][j-2] === player.symbol )   ){ //(4)2 danai dwaoyi
                        
                        let continuousTimes = 1 //chunka wai da aneyin aw shwenai ka hali abzherin(leyi dast pe akain symbol'akaya ka amanawe) //wa code akai xwarosh lasar awa ish aka ka aw danayi tyayayin la peshi yan dwawo das pe kain
                        for (let x = j+1; x < size; x++) {  if( array2d[i][x] === player.symbol ){  continuousTimes++    }else{    break;   }   }
                        // am 2 for loop'a la danakai pesh yan dwai awai batamain halibzherin dast pe aka u 7sab aka bzana chan jarai 3 ya + 1( let continuousTimes = 1 ) ka xoyati
                        for (let x = j-1; x >= 0; x--) {  if( array2d[i][x] === player.symbol ){  continuousTimes++    }else{    break;   }   }
                        if( continuousTimes%3===0 ){
                            return [i, j]
                        }
                    }
                 

                    if( (i-1>=0 && i+1<size && array2d[i-1][j] === player.symbol && array2d[i+1][j] === player.symbol)
                    ||  (i+2<size  && array2d[i+1][j] === player.symbol && array2d[i+2][j] === player.symbol) 
                    ||  (i-2>=0  && array2d[i-1][j] === player.symbol && array2d[i-2][j] === player.symbol)   ){


                        let continuousTimes = 1
                        for (let y = i+1; y < size; y++) {  if( array2d[y][j] === player.symbol ){  continuousTimes++    }else{    break;   }   }
                        for (let y = i-1; y >= 0; y--) {  if( array2d[y][j] === player.symbol ){  continuousTimes++    }else{    break;   }   }
                        if( continuousTimes%3===0 ){
                            return [i, j]
                        }
                    }


                    if( ((i-1>=0 && j-1>=0 && i+1<size && j+1<size) && array2d[i-1][j-1] === player.symbol && array2d[i+1][j+1] === player.symbol ) 
                    ||  (i+2<size && j+2<size && array2d[i+1][j+1] === player.symbol && array2d[i+2][j+2] === player.symbol) 
                    ||  (i-2>=0 && j-2>=0 && array2d[i-1][j-1] === player.symbol && array2d[i-2][j-2] === player.symbol) ){
                        let continuousTimes = 1
                        for (let y=i+1, x=j+1; y<size && x<size; y++, x++) {  if( array2d[y][x] === player.symbol ){  continuousTimes++    }else{    break;   }   }
                        for (let y=i-1, x=j-1; y>=0 && x>=0; y--, x--) {  if( array2d[y][x] === player.symbol ){  continuousTimes++    }else{    break;   }   }
                        if( continuousTimes%3===0 ){
                            return [i, j]
                        }
                    }


                    if( ((i+1<size && j-1>=0 && i-1>=0 && j+1<size)    && array2d[i+1][j-1] === player.symbol && array2d[i-1][j+1] === player.symbol)  
                    ||  (i+2<size && j-2>=0    && array2d[i+1][j-1] === player.symbol && array2d[i+2][j-2] === player.symbol)
                    ||  (i-2>=0 && j+2<size    && array2d[i-1][j+1] === player.symbol && array2d[i-2][j+2] === player.symbol)   ){
                        let continuousTimes = 1
                        for (let y=i+1, x=j-1;  y<size && x>=0; y++, x--) {  if( array2d[y][x] === player.symbol ){  continuousTimes++    }else{    break;   }   }
                        for (let y=i-1, x=j+1;  x<size && y>=0; y--, x++) {  if( array2d[y][x] === player.symbol ){  continuousTimes++    }else{    break;   }   }
                        if( continuousTimes%3===0 ){
                            return [i, j]
                        }
                    }
                }
            }
        }
        return 'noMatch'
    }

    function shuffle(array){
         //Fisher-Yates Shuffle
        // — To shuffle an array a of n elements (indices 0..n-1):
        // for i from n−1 downto 1 do
        //  j ← random integer such that 0 ≤ j ≤ i
        //  exchange a[j] and a[i]
        //In javascript, it’d be implemented as:
        for(let i=array.length-1; i > 0; i--){
            const j = Math.floor(Math.random() * i)
            const temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }
    }

    function computerThinkingMove(){
        //////////////////////////////// gain point 
        let array = computerChoose(player1, player1);
        if(array !== 'noMatch')  { return array  }
        //////////////////////////////// prevent point when {{size}}
        if(size >= 6){  
            array = computerChoose(player2, player1)
            if(array !== 'noMatch')  { return array  }    
        }
        //////////////////////////////// inner square
        let ii, jj, insideSquare = []
        for (let i = 1; i < size-1; i++) {	insideSquare.push(i);   }// ama tozek wrdtra// wata la {1 ta number-1-1} akata naw arrayakawa boya hich la qarax u suchakan nakat
        shuffle(insideSquare); //bas bo awai awanai nawo ba randomi hallbzheret nak tadriji
        for (let i = 0; i < insideSquare.length ; i++) { 
            for (let j = 0; j < insideSquare.length   ; j++) {
                ii = insideSquare[i];
                jj = insideSquare[j];   
                if(notTaken(ii, jj) === true){  return [ii, jj]   }
            }
        }
        //////////////////////////////// prevent point
        array = computerChoose(player2, player1)
        if(array !== 'noMatch')  { return array  }    
         //////////////////////////////// coreners 
        //har 4 corner'aka ba hard oce aikam ka wa xeratr abe bo javascript lawai loop'eka be  //if(i==0 || i==size-1 && j==0 || j==size-1) bam shewaya akra bas kati zortr awe boya 4 if'aka bashtra
        if(notTaken(0, 0) === true)          { return [0, 0]            }   
        if(notTaken(0, size-1) === true)     { return [0, size-1]       } 
        if(notTaken(size-1, 0) === true)     { return [size-1, 0]       } 
        if(notTaken(size-1, size-1) === true){ return [size-1, size-1]  } 
        //////////////////////////////// side >> qarax    
        for (let i = 0; i < size; i++) { //lera ba randomi la qarax hallabzheret
            for (let j = 0; j < size; j++) {
                if(i===0 || i===size-1 || j===0 || j===size-1) {	
                    ii = i; 
                    jj = j;    
                    if(notTaken(ii, jj)  === true){  return [ii, jj]   }
                }      
            }    
        }
    }
    
    function notTaken(i, j){
        return (array2d[i][j] !== player1.symbol && array2d[i][j] !== player2.symbol) ? true : false     
    }//return true if it's already taken


    return (
        <div>
        
            <GameJsx user={props.user} Player={Player}    gameRelated={gameRelated} calculate={calculate} resetCalculation={resetCalculation} computerThinkingMove={computerThinkingMove}  notTaken={notTaken} />
        </div>
    )
}

export default GameScipts

