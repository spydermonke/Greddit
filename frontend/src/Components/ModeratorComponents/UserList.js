import React from 'react'
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jwt from 'jwt-decode';
import NavbarModerator from '../SubGredditComponents/NavBarSubGreddit';
import { MDBContainer, MDBCard, MDBCardHeader, MDBCardTitle, MDBCardBody, MDBCardText } from 'mdb-react-ui-kit';

const UserList = () => {

  const params = useParams();
  const navigate = useNavigate();
  // const [status, setStatus] = useState(null);
  // const [user, setUser] = useState(null);
  const [moderator, setModerator] = useState(null);
  const [members, setMembers] = useState(null);
  const [blocked_users, setBlocked_users] = useState(null);



  useEffect(() => {

    const Fetchdata = async () => {

      let token = localStorage.getItem("token");
      let subgreddit_name = params.subgreddit_name;

      if (token) {
        let decoded_user = await jwt(token)
        let username = decoded_user.username;
        // setUser(decoded_user)
        getUserList(subgreddit_name);

        let response = await fetch(`http://localhost:4000/subgreddit/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "username": username,
            "subgreddit_name": subgreddit_name
          }),
        });
        let data = await response.json();

        if (data.status === "moderator" || data.status === "member" || data.status === "blocked" || data.status === "requested" || data.status === "normal_user") {
        }
        else {
          navigate("/subgreddit")
        }

      }
      else {
        navigate("/auth?mode=login")
      }
    }
    Fetchdata();
    // is said to disble the warning of react hook dependency missing
    // eslint-disable-next-line
  }, []);

  const getUserList = async (subgreddit_name) => {

    let response = await fetch(`http://localhost:4000/moderator/user_list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "subgreddit_name": subgreddit_name
      }),
    });
    let data = await response.json();
    setModerator(data.moderator);
    setMembers(data.members);
    setBlocked_users(data.blocked_users);

  }

  return (
    <>
      <NavbarModerator></NavbarModerator>
      <center>
        <h1> User List</h1>
      </center>

      <center>
        <h2> Moderator</h2>
      </center>

      <MDBContainer className="py-5 h-100 " >

        <div className="d-flex justify-content-evenly align-items-center h-100">
          {moderator && moderator.map((moderator) =>
            <div key={moderator.username}>

              <MDBCard className="shadow-0" style={{ maxWidth: '22rem' }}>
                <MDBCardHeader className="text-center">
                  <MDBCardTitle>{moderator.username} </MDBCardTitle>
                </MDBCardHeader>
                <MDBCardBody>
                  <MDBCardText>
                    {moderator.first_name} {moderator.last_name}
                  </MDBCardText>
                </MDBCardBody>

              </MDBCard>
            </div>
          )}
        </div>

      </MDBContainer>

      <center>
        <h2> Members</h2>
      </center>

      <MDBContainer className="py-5 h-100 " >
        <div className="d-flex justify-content-evenly align-items-center h-100">
          {members && members.map((members) =>
            <div key={members.username}>

              <MDBCard className="shadow-0" style={{ maxWidth: '22rem' }}>
                <MDBCardHeader className="text-center">
                  <MDBCardTitle>{members.username} </MDBCardTitle>
                </MDBCardHeader>
                <MDBCardBody>
                  <MDBCardText>
                    {members.first_name} {members.last_name}
                  </MDBCardText>
                </MDBCardBody>

              </MDBCard>
            </div>
          )}
        </div>

      </MDBContainer>

      <center>
        <h2> Blocked Users</h2>
      </center>

      <MDBContainer className="py-5 h-100 " >
        <div className="d-flex justify-content-evenly align-items-center h-100">

          {blocked_users && blocked_users.map((blocked_users) =>

            <div key={blocked_users.username}>
              <MDBCard className="shadow-0" style={{ maxWidth: '22rem' }}>
                <MDBCardHeader className="text-center">
                  <MDBCardTitle>{blocked_users.username} </MDBCardTitle>
                </MDBCardHeader>
                <MDBCardBody>
                  <MDBCardText>
                    {blocked_users.first_name} {blocked_users.last_name}
                  </MDBCardText>
                </MDBCardBody>

              </MDBCard>
            </div>
          )}
        </div>

      </MDBContainer>




    </>

  )
}

export default UserList