import React,{useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Main from './components/Main'
import ContactUs from './components/ContactUs'
import Nav from './components/Nav'


function App() {

  return (
    <Router>
  
      <div className="App">
     
          <Nav />
        
          <Switch>
            <Route path='/' exact component={() => <Main />}/>
            <Route path='/contactus' exact component={() => <ContactUs />}/>    
            <Route path="*"  component={() => <Main />} />
          </Switch>
          
      </div>
    </Router>
  )
}

export default App;


