import React from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Components_CSS/Register.css";
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


const Register = () => {

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
    var { first_name, last_name, age, contact_number, email, username, password } = document.forms[0];
    let btn = document.getElementById("submit");
    let isValid = true;
    if (first_name.value === "" || first_name.value === null) {
      isValid = false;
    }
    if (last_name.value === "" || last_name.value === null) {
      isValid = false;
    }
    if (age.value === "" || age.value === null) {
      isValid = false;
    }
    if (contact_number.value === "" || contact_number.value === null) {
      isValid = false;
    }
    if (email.value === "" || email.value === null) {
      isValid = false;
    }
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

    var { first_name, last_name, age, contact_number, email, username, password } = document.forms[0];


    const response = await fetch('http://localhost:4000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',

      },
      body: JSON.stringify({
        "first_name": first_name.value,
        "last_name": last_name.value,
        "email": email.value,
        "username": username.value,
        "password": password.value,
        "contact_number": contact_number.value,
        "age": age.value,
      })
    });

    let data = await response.json();

    if (data) {
      navigate('/auth?mode=login');
    }



  };




  return (
    <>
      {/* https://mdbootstrap.com/docs/react/extended/login-form/ from here */}
      <form onChange={enableSubmit} onSubmit={handleSubmit}>

        <MDBContainer fluid className='p-4'>

          <MDBRow>

            <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>

              <h1 className="my-5 display-3 fw-bold ls-tight px-3">
                <span className="text-primary">Greddit</span>
              </h1>

              <p className='px-3' style={{ color: 'hsl(217, 10%, 50.8%)' }}>
                A fun place for you to connect with fun people. Sign up now
              </p>

            </MDBCol>

            <MDBCol md='6'>

              <MDBCard className='my-5'>
                <MDBCardBody className='p-5'>

                  <MDBRow>
                    <MDBCol col='6'>
                      <MDBInput wrapperClass='mb-4' label='First name' id='first_name' type='text' />
                    </MDBCol>

                    <MDBCol col='6'>
                      <MDBInput wrapperClass='mb-4' label='Last name' id='last_name' type='text' />
                    </MDBCol>
                  </MDBRow>

                  <MDBInput wrapperClass='mb-4' label='Email' id='email' type='email' />
                  <MDBInput wrapperClass='mb-4' label='Username' id='username' type='text' />
                  <MDBInput wrapperClass='mb-4' label='Password' id='password' type='password' />

                  <MDBRow>
                    <MDBCol col='6'>
                      <MDBInput wrapperClass='mb-4' label='Contact' id='contact_number' type='text' />
                    </MDBCol>

                    <MDBCol col='6'>
                      <MDBInput wrapperClass='mb-4' label='Age' id='age' type='number' />
                    </MDBCol>
                  </MDBRow>

                  <MDBBtn className='w-100 mb-4' size='md' type='submit' id="submit" disabled>Sign Up</MDBBtn>

                  {/* <div className="text-center">

                    <p>or sign up with:</p>

                    <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                      <MDBIcon fab icon='facebook-f' size="sm" />
                    </MDBBtn>

                    <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                      <MDBIcon fab icon='twitter' size="sm" />
                    </MDBBtn>

                    <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                      <MDBIcon fab icon='google' size="sm" />
                    </MDBBtn>

                    <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                      <MDBIcon fab icon='github' size="sm" />
                    </MDBBtn>

                  </div> */}

                </MDBCardBody>
              </MDBCard>

            </MDBCol>

          </MDBRow>

        </MDBContainer>
      </form>
    </>

  )
}

export default Register