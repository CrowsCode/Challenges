const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express');


const cors = require('cors');
admin.initializeApp();
// const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors({ origin: true }));

const auth_code = '12345'


exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  
});

function request( res){
  console.log(222)


  admin.database().ref(`services/main/status`).once('value', async (snapshot) => { 
    let status = snapshot.val() || 'idle'
    console.log(status)
    if(status === 'idle' || status === undefined){
      console.log('start')
      await admin.database().ref(`services/main/current_orderID`).once('value', async (snapshot1) => { 
        let current_orderID = snapshot1.val() || 1
        console.log('before middle '+current_orderID)
        await admin.database().ref(`services/${current_orderID}`).once('value', async (snapshot2) => { 
          if(snapshot2.exists()){
            console.log('middle')
            console.log(snapshot2.val())
           
            await admin.database().ref(`services/main`).update({status: 'busy'})
            res.status(200).send(snapshot2.val())
            
          } else{
            res.status(200).send({message: 'no orders'})
            
          } 
        })
      })
    }else if(status === 'busy'){
      res.status(200).send({message: 'busy'})
    }
    // res.status(200).send({message: 'did not work 2'})
  })
  
  console.log('end')
  //  res.send({rr:'error'})
}

function postaa(req, res){
  console.log('posta start')
  if(auth(req.body['token'], res)){  return  }
  console.log('posta end')
  whenRequestFinishes(req.body['data'])
  res.status(201).send()
}


 async function whenRequestFinishes(orderObject){ //serviceOrder === raqami service aka
        
 

   
      const servicesRef = admin.firestore().collection('services').doc(String(orderObject.orderID))
      let batch = admin.firestore().batch();
      batch.set(servicesRef, {orderID:orderObject.orderID},{merge:true});
      batch.set(servicesRef, {uid:orderObject.uid},{merge:true});
      batch.set(servicesRef, {serviceName:orderObject.serviceName},{merge:true});
      batch.set(servicesRef, {info:orderObject.info},{merge:true});
      batch.set(servicesRef, {numberOfService:orderObject.numberOfService},{merge:true});
      batch.set(servicesRef, {cost:orderObject.cost},{merge:true});
      console.log(11)
      const currentUserServicesRef = admin.firestore().collection('users').doc(orderObject.uid).collection('services').doc(String(orderObject.orderID))
      batch.set(currentUserServicesRef, {orderID:orderObject.orderID},{merge:true});
      batch.set(currentUserServicesRef, {serviceName:orderObject.serviceName},{merge:true});
      batch.set(currentUserServicesRef, {info:orderObject.info},{merge:true});
      batch.set(currentUserServicesRef, {numberOfService:orderObject.numberOfService},{merge:true});
      batch.set(currentUserServicesRef, {cost:orderObject.cost},{merge:true});
      
console.log(22)
       admin.database().ref(`services/${orderObject.orderID}/`).remove()
       admin.database().ref(`users/${orderObject.uid}/orders/${orderObject.orderID}`).remove()
     
      let updates = {}
      updates[`services/main/status`] = 'idle'
      updates[`services/main/current_orderID`] = parseInt(orderObject.orderID)+1
      await admin.database().ref(`total`).once('value',  (snapshot) => { 
        let total_obj = snapshot.val() || {}
        updates[`total/totalSpent`] = total_obj.totalSpent === undefined ? orderObject.cost : total_obj.totalSpent + orderObject.cost
        updates[`total/${orderObject.serviceName}/totalSpent`] =  total_obj[orderObject.serviceName] === undefined ? orderObject.cost : total_obj[orderObject.serviceName].totalSpent + orderObject.cost
        updates[`total/${orderObject.serviceName}/totalNumberOfService`] =  total_obj[orderObject.serviceName] === undefined ? orderObject.numberOfService : total_obj[orderObject.serviceName].totalNumberOfService + orderObject.numberOfService
      })
      
console.log(33)
      await admin.database().ref(`users/${orderObject.uid}/total`).once('value',  (snapshot) => { 
        let total_obj = snapshot.val() || {}
        updates[`users/${orderObject.uid}/total/totalSpent`] = total_obj.totalSpent === undefined ? orderObject.cost : total_obj.totalSpent + orderObject.cost
        updates[`users/${orderObject.uid}/total/${orderObject.serviceName}/totalSpent`] =  total_obj[orderObject.serviceName] === undefined ? orderObject.cost : total_obj[orderObject.serviceName].totalSpent + orderObject.cost

        updates[`users/${orderObject.uid}/total/${orderObject.serviceName}/totalNumberOfService`] = 
        total_obj[orderObject.serviceName] === undefined ? orderObject.numberOfService : total_obj[orderObject.serviceName].totalNumberOfService + orderObject.numberOfService
      })
      
console.log(44)
      await admin.database().ref(`/`).update(updates)
      console.log(55)
      await batch.commit()
      console.log(66)
}


function addCodes(req, res){

  console.log(req.body)

  if(auth(req.body['token'], res)){  return  }
  
  array = req.body['data']
  let updates = {}
  for (let i = 0; i < array.length; i++) {
    updates[array[i].code] = array[i].balance
  }
  admin.database().ref(`codes`).update(updates)
  res.status(200).send()
}

function auth(auth_token, res){
  if(auth_token !== auth_code){
    console.log('unauthnicated')
    res.status(401).send()
    return true
  }
  console.log('authnicated')
  return false
}





// app.get('/:id', (req, res) => res.send(Widgets.getById(req.params.id)));
app.post('/', (req, res) => {postaa(req, res);});
app.post('/statusToBusy', (req, res) => {updateStatusToBusy(req, res);});
app.post('/codes', (req, res) => {addCodes(req, res);});
app.put('/:id', (req, res) =>{ 
  console.log(req.query)
  res.status(200).send('put')
});

app.delete('/:id', (req, res) => res.send(Widgets.delete(req.params.id)));
app.get(`/${auth_code}`, (req, res) => {request( res);});













// // use body-parser middleware
// app.use(bodyParser.json());


// error handling middleware
app.use(function(err, req, res, next){
    console.log(err); // to see properties of message in our console
    res.status(422).send({error: err.message});
});

// // listen for requests
// app.listen(process.env.port || 4000, function(){
//     console.log('now listening for requests');
// });

// Expose Express API as a single Cloud Function:
exports.functions = functions.https.onRequest(app);

// exports.redeemCode = functions.https.onCall((data, context) => {
//   if (!context.auth) {
//     throw new functions.https.HttpsError(
//       'unauthenticated', 
//       'only authenticated users can redeem code'
//     );
//   }
//   admin.database().ref(`codes/${data.text}`).once('value').then( (snapshot) => {   
//     if(snapshot.exists()){
//       let giftcardBalance = snapshot.val()
//       admin.database().ref(`users/${context.auth.uid}/balance`).once('value').then( (snap) => {   
//         if(snapshot.exists()){
//           let userBalance = snap.val()
//           userBalance += giftcardBalance
//           firebase.database().ref(`users/${context.auth.uid}/`).update(  {balance: userBalance})
        



//           const currentUserCodesRef = firebase.firestore().collection('users').doc(context.auth.uid).collection('codes').doc(date_text)
//           const batch = firebase.firestore().batch();
//           batch.set(currentUserCodesRef, {balance:userBalance},{merge:true});
//           batch.commit()






//         }  
//         return 'ss'
//         }).catch()
//     }
//     return null 
//   }).catch()
  
 
// });













// // Message text passed from the client.
// const text = data.text;
// // Authentication / user information is automatically added to the request.
// const uid = context.auth.uid;
// const name = context.auth.token.name || null;
// const picture = context.auth.token.picture || null;
// const email = context.auth.token.email || null;
