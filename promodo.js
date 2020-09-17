//setInterval(drawClock, 1000);
var pauseBoolean =true;;
var mainInterval;
var breakLength = getBreak();
var sessionLength = getSession();

function start() {
    
    // sarata booleanaka true a ba pause() akai start abe ba false u interval aka bardawam abe
    // wa ka pause() akre ba click awa false aka abe ba true u clear akre 
    //ka dubara pause() ba click akreto awa true aka abe ba flase wa labar awa false a start() call akre bas la start() da pause() eki kai leya boya dubara false aka abeto ba true
    //wata chan jar pause aka bkreto boolean aka har true ameneto
    //hata start akreto ka true aka aka ba false
    pause();    
    mainInterval = setInterval(main, 100);

}

function main() {
    console.log(1);
    let minutes = getMinutes();
    let seconds = getSeconds();

    if(seconds == 0 & minutes == 0){ 
        if(document.querySelector("#timer-label").innerHTML == "Session"){
            breakTime(); return; 
        }else{
            sessionTime(); return;
        }
         }

    if(seconds == 0){   minutes--; seconds=59;   }
    else{  seconds--;  }
   
    if(seconds == 0){  seconds= '00'; }

    setMinutes(minutes);
    setSeconds(seconds);
    
}

function sessionTime(){
    document.querySelector("#timer-label").innerHTML = "Session";
    setMinutes(getSession());
    setSeconds(0);
}

function breakTime(){
    document.querySelector("#timer-label").innerHTML = "Break";
    setMinutes(getBreak());
    setSeconds(0);
}

function pause() {
    if(pauseBoolean == true){  pauseBoolean = false; }
    else if(pauseBoolean == false){  pauseBoolean = true; }

    if(pauseBoolean == false){  start();   }
    if(pauseBoolean == true){   clearInterval(mainInterval); }
}

function reset(){
    clearInterval(mainInterval);
    setMinutes(getSession());
    setSeconds(0);
    sessionTime();
}
function solve(s){
    let length1=0;
    let length2=0;
    var patt = new RegExp("[aeiou]");
    for(let i=0; i<s.length; i++){
      if(patt.test(s.charAt(i))){
        length1++;
    }else{
         length1=0;
      }
      if(length1 > length2){
      length2=length1;
     
    }
      }
    
   return length2;
  }


function getMinutes() {
    return document.querySelector("#minutes").value;
}
function setMinutes(n) {
    if((""+n).length == 1){
        document.querySelector("#minutes").value = "0"+n;
    }else{
        document.querySelector("#minutes").value = n;
    }
   
}


function getSeconds() {
    return document.querySelector("#seconds").value;
}
function setSeconds(n) {
    if((""+n).length == 1){
        document.querySelector("#seconds").value = "0"+n;
    }else{
        document.querySelector("#seconds").value = n;
    }

    
}

function changeBreak(n) {

    let temp = parseInt(getBreak()) + n;
    if (temp == 0 || temp > 60) {
        return;
    }
    setBreak(temp);
}

function changeSession(n) {

    let temp = parseInt(getSession()) + n;
    if (temp == 0 || temp > 60) {
        return;
    }
    setSession(temp);
}

function getBreak() {
    return document.querySelector("#break-length").innerHTML;
}

function setBreak(n) {
    document.querySelector("#break-length").innerHTML = n;
    if(document.querySelector("#timer-label").innerHTML == "Break"){
        setMinutes(getBreak()); 
    }
}

function getSession() {
    return document.querySelector("#session-length").innerHTML;
}

function setSession(n) {
    document.querySelector("#session-length").innerHTML = n;
    if(document.querySelector("#timer-label").innerHTML == "Session"){
        setMinutes(getSession()); 
    }
}