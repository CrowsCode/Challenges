import React,{useEffect, useState} from 'react';
import firebase from 'firebase/app'
import 'firebase';
import './App.css'
import {createMuiTheme,ThemeProvider,RadioGroup,Radio,FormControlLabel,FormLabel,FormHelperText,FormControl,Grid, Container, Typography, TextField, Button, } from '@material-ui/core';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import 'firebase/firestore';


const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#4a536b',
    },
    secondary: {
      main:  '#ff9a8d',
    },
  },
});


function App() {

  const[search, set_search] = useState('')
  const[phone, set_phone] = useState(0)
  const[description, set_description] = useState('')




  const [collectionObject,set_collectionObject ] = useState({})
  const [collectionArray,set_collectionArray ] = useState([])
  const [given_collectionArray,set_given_collectionArray ] = useState([])
  
  
    
  function getDatas(){
    let temp_collectionObject = {}, temp

    firebase.firestore().collection('orders').get().then( (snapshot) => { // eslint-disable-line no-loop-func
        snapshot.forEach((doc) => { 
            temp = doc.data();  
          temp_collectionObject[doc.id] = temp;   
        });//await la naw loop warning ayat boya aw eslint ai sarom danawa
        set_collectionObject( temp_collectionObject )
        let temp_array = Object.keys(temp_collectionObject)
        /////////////////////sort
        let swap = 0
        for (let i = 0; i < temp_array.length; i++) {
          for (let j = 0; j < temp_array.length; j++) {
            if(temp_collectionObject[temp_array[i]].time > temp_collectionObject[temp_array[j]].time){
              swap = temp_array[i] 
              temp_array[i]  = temp_array[j] 
              temp_array[j] = swap
            }
          } 
      }
       /////////////////////
        set_collectionArray(temp_array)
        set_given_collectionArray( temp_array.length === 0 ? [] : temp_array ) 
        
    }).catch( (error) => {    console.log("Error getting document:", error);    });

  }
  
  
  useEffect(() => {
  
    getDatas()
  }, [])




  function addOrder(e){
    e.preventDefault()
      let time = firebase.firestore.FieldValue.serverTimestamp()
      const currentGameRef = firebase.firestore().collection('orders').doc()

      const batch = firebase.firestore().batch();
      batch.set(currentGameRef, {phone: phone},{merge:true}); 
      batch.set(currentGameRef, {description: description},{merge:true}); 
      batch.set(currentGameRef, {time:  firebase.firestore.FieldValue.serverTimestamp()},{merge:true}); 

  
      batch.commit().then(  () => {
          
      });   
      setTimeout(() => {
        getDatas()
      }, 2000);
     
  }

  function handleSearch(value){
    set_search(value);
    let temp = []
    for(let i=0; i<collectionArray.length; i++){
      console.log(collectionObject[collectionArray[i]].phone )
      if(collectionObject[collectionArray[i]].phone === value+""){
        temp.push([collectionArray[i]])
      }
    }
    if(temp.length > 0){
      set_given_collectionArray(temp)
    }
  }

  const [sort, set_sort] = useState('Latest');
  const handleSort = (event) => {
    set_sort(event.target.value);

    console.log(event.target.value)
    
    if(event.target.value === "Latest"){
      set_given_collectionArray( collectionArray.reverse() || []) 
    }else{
      set_given_collectionArray(collectionArray.reverse() || []);
    }
  };




  function removeCard(docName){

    let time = firebase.firestore.FieldValue.serverTimestamp()
    const currentGameRef = firebase.firestore().collection('history').doc()

    const batch = firebase.firestore().batch();
    batch.set(currentGameRef,  collectionObject[docName],{merge:true}); 
    batch.commit().then(  () => {
        
    });   
  
    
    firebase.firestore().collection('orders').doc(docName).delete(); 
    let array = [...collectionArray]
    for(let i=0; i< collectionArray.length; i++){
      if(array[i] === docName){
        array.splice(i, 1)
      }
    }
    set_collectionArray(array)
    set_given_collectionArray( array)  
  }


  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <form  onSubmit={(e) =>{ }} id="form-settings">
          <Grid item xs={12} spacing={1} container justify="space-around" alignItems="center">
            <Grid item lg={9} sm ={12} xs={12} spacing={1} container justify="space-around" alignItems="center">

              <Grid item  xs={11} sm={3} lg={3}>
                  <TextField fullWidth    label="Phone Number" variant="outlined" type="number"
                  value={phone}  onChange={(e) => { set_phone(e.target.value)}}
                  />
              </Grid>
              <Grid item   xs={11} sm={8} lg={8}>
                  <TextField fullWidth    label="Description" variant="outlined"
                  value={description}  onChange={(e) => { set_description(e.target.value)}}
                  />
              </Grid>
            </Grid>

              <Grid item lg={3} sm ={6} xs={9}>
                <Button onClick={e => {addOrder(e)}} fullWidth variant="outlined" color="primary">Add Order</Button>
              </Grid>                
          </Grid>
        </form>
        
        
        <Grid id="show" item xs={12} spacing={1} container  justify="space-around" alignItems="center">
          <Grid item lg={5} sm={5} xs={10}>
            <FormControl component="fieldset" >
              {/* <FormLabel component="legend">Sort by prices</FormLabel> */}
              <RadioGroup aria-label="Sort" name="prices" value={sort} onChange={handleSort}>
                <Grid  spacing={1} container direction="column" justify="space-between" alignItems="space-between">
                  <FormControlLabel value="Latest" control={<Radio />} label="Sort byLatest"  />
                  <FormControlLabel value="Oldest" control={<Radio />} label="Sort by Oldest"  />
                </Grid>
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item lg={5} sm={5} xs={10}>
            <TextField fullWidth    label="Search" variant="outlined"
              value={search}  onChange={(e) => { handleSearch(e.target.value)}}
              />
          </Grid>
        </Grid>

        <Grid id="orders" item xs={12} spacing={5} container  justify="space-around" alignItems="center">
          { given_collectionArray.map((key, index) =>{
            return ( 
              <Grid  key={key+index} id="order" item xs={12} spacing={1} container justify="space-around" alignItems="center">

                <Grid item  xs={11} sm={5} lg={2}>
                    <TextField disabled fullWidth    label="Phone Number" variant="outlined" type="number"
                    value={collectionObject[key].phone}  
                    />
                </Grid>
                <Grid item  xs={11} sm={6} lg={2}>
                    <TextField disabled fullWidth    label="Date" variant="outlined" 
                    value={collectionObject[key].time === null ? '' : collectionObject[key].time.toDate().toUTCString()}  
                    />
                </Grid>
                <Grid item   xs={11} sm={10} lg={6}>
                    <TextField disabled fullWidth    label="Description" variant="outlined"
                    value={collectionObject[key].description}
                    />
                </Grid>
                <Grid item  xs={11} sm ={1} lg={1}>
                  <Button fullWidth onClick={()=>{removeCard(key)}}   variant="outlined" color="secondary">X</Button>
                </Grid>     
              </Grid>
              )
            })
          }
        </Grid>
      </ThemeProvider>
    </div>
  );
}

export default App;

