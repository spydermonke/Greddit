import React from 'react'
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jwt from 'jwt-decode';
import NavbarModerator from '../SubGredditComponents/NavBarSubGreddit';
import { MDBContainer, MDBCard, MDBCardHeader, MDBCardTitle, MDBCardBody, MDBCardText, MDBCardFooter, MDBBtn } from 'mdb-react-ui-kit';
import { MDBRow, MDBCol } from 'mdb-react-ui-kit';

const Reported_Page = () => {

  const params = useParams();
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [edit_access, setEdit] = useState(false);
  



  useEffect(() => {

    const Fetchdata = async () => {

      let token = localStorage.getItem("token");
      let subgreddit_name = params.subgreddit_name;

      if (token) {
        let decoded_user = await jwt(token)
        let username = decoded_user.username;

        await getReports(subgreddit_name);
        // console.log("This is report", reports);
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
        else if (data.status === "member" || data.status === "blocked" || data.status === "requested" || data.status === "normal_user") {
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

  const getReports = async (subgreddit_name) => {
    const response = await fetch(`http://localhost:4000/moderator/reported_posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "in_subgreddit": subgreddit_name
      }),
    });
    const data = await response.json();
    // setReports(data);
    // yahan dikkat hain
    // console.log("This is data", data)
    setReports(data);

    

  }

  const IgnoreReport = async (report_id) => {

    const response = await fetch(`http://localhost:4000/moderator/ignorereportedpost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "report_id": report_id
      }),
    });
    const data = await response.json();
    console.log("This is data", data)
    reports.filter((report) => report.report_id !== report_id)
    window.location.reload();

    


  }

  const UnIgnore = async (report_id) => {
      
      const response = await fetch(`http://localhost:4000/moderator/unignorereportedpost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "report_id": report_id
        }),
      });
      const data = await response.json();
      console.log("This is data", data)
      reports.filter((report) => report.report_id !== report_id)
      window.location.reload();

  }

  const DeletePost = async (report_id) => {

    const response = await fetch(`http://localhost:4000/moderator/deletereportedpost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "report_id": report_id
      }),
    });
    const data = await response.json();
    console.log("This is data", data)
    reports.filter((report) => report.report_id !== report_id)
    window.location.reload();
    



  }


  const BlockPost = async (report_id) => {


    const response = await fetch(`http://localhost:4000/moderator/blockreportedpost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "report_id": report_id
      }),
    });
    const data = await response.json();
    console.log(data)
    alert("Poster has been blocked")
    reports.filter((report) => report.report_id !== report_id)
    window.location.reload();

    
  }






  return (
    <>
      <NavbarModerator></NavbarModerator>
      <>The following Reports have been made: </>
      <br></br>
      <MDBContainer className="py-5 h-100 " >

        <div className="d-flex justify-content-evenly align-items-center h-100 flex-wrap">
          {reports && reports.map((report) =>
            <div key={report._id}>
              <MDBCard className="shadow-0" style={{ maxWidth: '22rem' }}>
                <MDBCardHeader className="text-center">
                  <MDBCardTitle>Reported By: {report.reported_by.username} </MDBCardTitle>
                  <MDBCardTitle>User reported: {report.poster.username} </MDBCardTitle>
                </MDBCardHeader>
                <MDBCardBody>
                  <MDBCardText>
                    Post Content: {report.post_content}
                  </MDBCardText>
                  <MDBCardText>
                    Reason: {report.reason}
                  </MDBCardText>

                  {edit_access &&

                    <MDBRow className="d-flex justify-content-around">
                      <MDBCol>
                        { report.status === "pending" &&
                        <button className="btn btn-success" id="ignore" onClick={() => IgnoreReport(report._id)} >Ignore</button>
                  }
                  {
                    report.status === "Ignored" &&
                    <button className="btn btn-success" id="ignored" onClick={() => UnIgnore(report._id)} >Un -Ignore</button>
                  }

                      </MDBCol>
                      <MDBCol>
                        { report.status === "pending" &&
                          <button className="btn btn-danger" id="delete" onClick={(event) => { DeletePost(report._id) ;  }}>Delete</button>
                        }
                      </MDBCol>
                    </MDBRow>
                  }

                </MDBCardBody>
                {edit_access &&
                  <MDBCardFooter className="text-muted text-center">
                   { report.status === "pending" && 
                      <MDBBtn id="block" onClick={(event) => { BlockPost(report._id) }}> Block User </MDBBtn>
                }
                {
                  report.status === "Blocked" &&
                  <MDBBtn id="blocked">  User is Blocked</MDBBtn>
                }
     

                  </MDBCardFooter>
                }



              </MDBCard>
            </div>
          )}
        </div>

      </MDBContainer>

    </>
  )
}

export default Reported_Page