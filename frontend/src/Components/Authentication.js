import React, { useState, useEffect } from 'react';
import Login from './Login.js';
import Register from './Register.js';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Authentication = () => {

  let location = useLocation()
  const [whichform, setwhichform] = useState();

  let navigate = useNavigate()


  useEffect(() => {
    setwhichform(location.search)
  }, [location])

  useEffect(() => {

    let token = localStorage.getItem("token");
    if (token) {
      navigate('/profile')
    }
    // is said to disble the warning of react hook dependency missing
    //eslint-disable-next-line 
  }, [])



  return (
    <>
      <div className="d-flex justify-content-center">
      <div className="btn-group shadow-0" role="group" aria-label="Basic example" >
        <button
          type="button"
          className="  p-4 m-2 btn btn-outline-secondary"

          onClick={() => { navigate('/auth?mode=login') }}>
          Login
        </button>
        <button
          type="button"
          className="  p-4 m-2 btn btn-outline-secondary"

          onClick={() => { navigate('/auth?mode=register') }} >
          Register
        </button>
      </div>
      </div>
      {whichform === "?mode=login" && <Login />}
      {whichform === "?mode=register" && <Register />}

    </>
      
  )
}

export default Authentication