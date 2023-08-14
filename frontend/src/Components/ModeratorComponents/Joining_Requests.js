import React from 'react'
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jwt from 'jwt-decode';
import NavbarModerator from '../SubGredditComponents/NavBarSubGreddit';
import { MDBContainer, MDBCard, MDBCardHeader, MDBCardTitle, MDBCardBody, MDBCardText } from 'mdb-react-ui-kit';
import { MDBRow, MDBCol } from 'mdb-react-ui-kit';

const JoiningRequests = () => {

  const params = useParams();
  const navigate = useNavigate();

  const [joining_requests, setJoining_requests] = useState();
  const [edit_access, setEdit] = useState(false);

  useEffect(() => {

    const Fetchdata = async () => {

      let token = localStorage.getItem("token");
      let subgreddit_name = params.subgreddit_name;

      if (token) {
        let decoded_user = await jwt(token)
        let username = decoded_user.username;

        getJoiningRequests(subgreddit_name);

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
        if (data.status === "moderator") {
          setEdit(true)
        }
        else if ( data.status === "member" || data.status === "blocked" || data.status === "requested" || data.status === "normal_user"){
          setEdit(false)

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

  const getJoiningRequests = async (subgreddit_name) => {

    let response = await fetch(`http://localhost:4000/moderator/joining_request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "subgreddit_name": subgreddit_name
      }),
    });
    let data = await response.json();
    console.log(data)
    setJoining_requests(data);
  }

  const AcceptUser = async (username, first_name, last_name) => {

    let respone = await fetch(`http://localhost:4000/moderator/accept_joining_request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "subgreddit_name": params.subgreddit_name,
        "username": username,
        "first_name": first_name,
        "last_name": last_name
      }),
    });
    let data = await respone.json();
    console.log(data)
    getJoiningRequests(params.subgreddit_name);
  }

  const RejectUser = async (username) => {

    let respone = await fetch(`http://localhost:4000/moderator/reject_joining_request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "subgreddit_name": params.subgreddit_name,
        "username": username
      }),
    });
    let data = await respone.json();
    console.log(data)
    getJoiningRequests(params.subgreddit_name);
  }



  return (
    <>
      <NavbarModerator></NavbarModerator>

      <MDBContainer className="py-5 h-100 " >

        <div className="d-flex justify-content-evenly align-items-center h-100">
          {joining_requests && joining_requests.map((joining_requests) =>
            <div key={joining_requests.username}>

              <MDBCard className="shadow-0" style={{ maxWidth: '22rem' }}>
                <MDBCardHeader className="text-center">
                  <MDBCardTitle>{joining_requests.username} </MDBCardTitle>
                </MDBCardHeader>
                <MDBCardBody>
                  <MDBCardText>
                    Has Requested to join the subgreddit
                  </MDBCardText>
                  {edit_access &&
                  <MDBRow className="d-flex justify-content-evenly">
                    <MDBCol>
                      <button className="btn btn-success" onClick={() => AcceptUser(joining_requests.username, joining_requests.first_name,joining_requests.last_name)}>Accept</button>
                    </MDBCol>
                    <MDBCol>
                      <button className="btn btn-danger" onClick={() => RejectUser(joining_requests.username)} >Reject</button> 
                    </MDBCol> 
                  </MDBRow>
}
                </MDBCardBody>

              </MDBCard>
            </div>
          )}
        </div>

      </MDBContainer>




    </>
  )
}

export default JoiningRequests