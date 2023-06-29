import React from 'react'
import './ContactUs.scss'
import logo from '../images/owner.jpg';
import lizard from '../images/lizard2.png';

import Facebook from '../images/Facebook.svg';
import Twiter from '../images/Twiter.svg';
import Github from '../images/Github.svg';



function ContactUs() {
    return (
        <div id="contactUs-container">
              
            <div id="middle">
                

                <img id="left" src={logo} alt="owner" />

                <div id="right">    
                    <div id="right-title">
                        About
                    </div>
                    <div id="right-content">
                        Hi There, I am Balen from Iraq. At the time of writing this I am a student of koya University, I created this small website as a part of a class assignment, it took less than 15 hours from start to finish.
                        <br/><br/>  As a result, One Could find quite a lot of flaws and short-comings in it.
                    </div>

                    <img id='loading-dot' src={lizard} alt='ball'/>
                </div>



            </div>

            <div id="footer">

                <div id="icons">
                    <a href='https://www.facebook.com/zuck'  target="_blank" className="social-icon"   >
                        <img src={Facebook} className="social-icon-img" />
                    </a> 
                    <a href='https://twitter.com/finkd?lang=en' target="_blank"  className="social-icon"  >
                        <img src={Twiter} className="social-icon-img" />
                    </a> 
                    <a href='https://github.com/mark-zuckerberg'  target="_blank" className="social-icon" >
                        <img src={Github} className="social-icon-img"   />
                    </a> 
                </div>
              
            </div>  
        </div>
    )
}

export default ContactUs
