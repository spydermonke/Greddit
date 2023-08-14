import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import jwt from 'jwt-decode'
import Navbar from "./Navbar";
import '../Components_CSS/Profile.css'

import { MDBBtn, MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography, MDBInput } from 'mdb-react-ui-kit';

const Profile = () => {
  let navigate = useNavigate();

  const [user, setuser] = useState({})
  const [edit_func, setedit_func] = useState(false)
  const [new_Data, setnew_Data] = useState()


  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      let decoded_user = jwt(token)
      setuser(decoded_user)
      setnew_Data(decoded_user)
    }
    // is said to disble the warning of react hook dependency missing
    // eslint-disable-next-line
  }, []);



  const followers_func = () => {
    navigate("/profile/followers")
  }

  const following_func = () => {
    navigate("/profile/followings")
  }

  const potential_following_func = () => {
    navigate("/profile/potential_followings")
  }

  const edit_profile = async () => {
    if (!edit_func) {
      setedit_func(true)
    }
    else {
      setedit_func(false)
      const response = await fetch('http://localhost:4000/users/updateprofile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({
          "newData": new_Data
        })
      });

      let data = await response.json();
      localStorage.removeItem("token")
      localStorage.setItem("token", data.token);
    }
  };

  const onChange_func = (e) => {
    setnew_Data({ ...new_Data, [e.target.name]: e.target.value });
    setuser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Navbar>      </Navbar>
      {console.log(edit_func)}


      <section className="vh-100" style={{ backgroundColor: '#f4f5f7' }}>
        <MDBContainer className="py-5 h-100 " >
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol lg="9" xl="7" className="mb-4 mb-lg-0">
              <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
                <MDBRow className="g-0">
                  <MDBCol md="4" className="gradient-custom text-center text-white"
                    style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                    <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                      alt="Avatar" className="my-5" style={{ width: '80px' }} fluid />
                    <MDBTypography tag="h5">{user.username}</MDBTypography>
                    {!edit_func && <MDBCardText> {user.first_name + " " + user.last_name + " , " + user.age}  </MDBCardText>}
                    {edit_func && <MDBCardText> <input type="text" name="first_name" value={new_Data.first_name} onChange={onChange_func} /> <input type="text" name="last_name" value={new_Data.last_name} onChange={onChange_func} /> , <input type="number" name="age" value={new_Data.age} onChange={onChange_func} /> </MDBCardText>}
                  </MDBCol>
                  <MDBCol md="8">
                    <MDBCardBody className="p-4">
                      <MDBTypography tag="h6">Contact Information</MDBTypography>
                      <hr className="mt-0 mb-4" />
                      <MDBRow className="pt-1">
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">Email</MDBTypography>
                          <MDBCardText className="text-muted">{user.email}</MDBCardText>
                        </MDBCol>
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">Phone</MDBTypography>
                          {!edit_func && <MDBCardText className="text-muted">{user.contact_number}</MDBCardText>}
                          {edit_func && <MDBCardText className="text-muted"> {<MDBInput type="text" name="contact_number" value={new_Data.contact_number} onChange={onChange_func} />} </MDBCardText>}
                        </MDBCol>
                      </MDBRow>

                      <MDBTypography tag="h6">About Me</MDBTypography>
                      <hr className="mt-0 mb-4" />
                      <MDBRow className="pt-1">
                        {!edit_func && <MDBCardText className="text-muted">{user.user_description}</MDBCardText>}
                        {edit_func && <MDBCardText className="text-muted"> <MDBInput type="text" name="user_description" value={new_Data.user_description} onChange={onChange_func} /> </MDBCardText>}
                      </MDBRow>

                      <br></br>

                      <MDBTypography tag="h6">Followers and Following</MDBTypography>
                      <hr className="mt-0 mb-4" />
                      <MDBRow className="pt-1">
                      <MDBCol size="6" className="mb-3">
                      <MDBTypography tag="h6">Followers</MDBTypography>
                      {< MDBBtn className='mb-3' size='md' id="followers_button" onClick={followers_func} >{user.followers_num}</MDBBtn>}
                      </MDBCol>
                      <MDBCol size="6" className="mb-3">
                      <MDBTypography tag="h6">Following</MDBTypography>
                      {< MDBBtn className=' mb-3' size='md' id="following_button" onClick={following_func} >{user.followings_num}</MDBBtn>}
                      </MDBCol>
                      {< MDBBtn className='mb-3' size='md' id="followers_button" onClick={potential_following_func} >More People to Follow</MDBBtn>}
                      </MDBRow>
                    </MDBCardBody>
                  </MDBCol>
                </MDBRow>
              </MDBCard>
              {!edit_func && <MDBBtn className='w-100 mb-4' size='md' id="edit_button" onClick={edit_profile} >Edit Profile</MDBBtn>}
              {edit_func && <MDBBtn className='w-100 mb-4' size='md' id="save_button" onClick={edit_profile}>Save Edited Profile</MDBBtn>}
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>


    </>
  );
};

export default Profile;
