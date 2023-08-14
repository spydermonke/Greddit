import React from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
}
  from 'mdb-react-ui-kit';


const Login = () => {

  let navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      navigate('/profile')
    }
    // is said to disble the warning of react hook dependency missing
    //eslint-disable-next-line 
  }, [])


  const enableSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();
    var { username, password } = document.forms[0];
    let btn = document.getElementById("submit");
    let isValid = true;
    if (username.value === "" || username.value === null) {
      isValid = false;
    }
    if (password.value === "" || password.value === null) {
      isValid = false;
    }

    btn.disabled = !isValid;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    var { username, password } = document.forms[0];


    const response = await fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',

      },
      body: JSON.stringify({
        "username": username.value,
        "password": password.value,
      })
    });

    let data = await response.json();
    console.log(data)





    if (data.error) {
      alert(data.error)
    }
    else {

      localStorage.setItem("token", data.token);

      navigate('/profile')
    }
  }



  return (
    <div className="app">
      <div className="login-form">


        <form onSubmit={handleSubmit} onChange={enableSubmit}>
          <div>
            {/* https://frontendshape.com/post/bootstrap-5-login-form-page-example earlier was taken from here */}


            <MDBContainer fluid className='p-4'>

              <MDBRow>

                <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>

                  <h1 className="my-5 display-3 fw-bold ls-tight px-3">
                    <span className="text-primary">Greddit</span>
                  </h1>

                  <p className='px-3' style={{ color: 'hsl(217, 10%, 50.8%)' }}>
                    A fun place for you to connect with fun people. Login Now!
                  </p>

                </MDBCol>
                <MDBCol md='6'>
                  <MDBCard className='my-5'>
                    <MDBCardBody className='p-5'>
                      <MDBInput wrapperClass='mb-4' label='Username' id='username' type='text' />
                      <MDBInput wrapperClass='mb-4' label='Password' id='password' type='password' />
                      <MDBBtn className='w-100 mb-4' size='md' type='submit' id="submit" disabled>Sign In</MDBBtn>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login

