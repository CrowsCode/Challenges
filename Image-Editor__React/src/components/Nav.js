import React from 'react'
import logo from '../images/logo.png';
import  './Nav.scss'; 
import {Link} from 'react-router-dom'

function Nav() {
    return (
        <>
            <nav id="top-nav">
                <Link to='/' >
                    <img id="logo" src={logo} alt="logo"/>
                </Link> 
                
                <Link to='/contactus'   id="top-nav-right">
                    Contact&nbsp;Us
                </Link> 
            </nav>
        </>
    )
}

export default Nav
