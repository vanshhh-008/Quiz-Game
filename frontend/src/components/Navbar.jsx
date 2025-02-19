import React from 'react'
import logo from "../logo2.png";
export default function Navbar() {
  return (
    <>
  
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Audiowide"></link>
<nav className="navbar navbar-dark bg-dark">

  <a className="navbar-brand" href="#">
  <div class="d-flex justify-content-between">
    <img src={logo} width="50" height="50" className="d-inline-block align-top" alt=""/>
     <h3 style={{color:'white',margin:'12px',fontFamily:'Audiowide'}}>Quiz Game</h3>
     </div>
  </a>
</nav>


    </>
  )
}
