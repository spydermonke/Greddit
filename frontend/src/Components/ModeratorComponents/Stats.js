import React from 'react'
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jwt from 'jwt-decode';
import NavbarModerator from '../SubGredditComponents/NavBarSubGreddit';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

export const Stats = () => {

  const params = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reportstat, setReportstat] = useState({});


  useEffect(() => {

    const Fetchdata = async () => {

      let token = localStorage.getItem("token");
      let subgreddit_name = params.subgreddit_name;

      if (token) {
        let decoded_user = await jwt(token)
        let username = decoded_user.username;

        await getStats(subgreddit_name);



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

  const getStats = async (subgreddit_name) => {
    let response = await fetch(`http://localhost:4000/moderator/stats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "subgreddit_name": subgreddit_name
      }),
    });
    let data = await response.json();
    // setReports(data);

    setMembers(data.members_groupbydate_num);
    setPosts(data.posts_groupbydate_num);
    setReportstat(data.reportstat);


  }



  return (
    <>
      <NavbarModerator></NavbarModerator>

      {/* {reports && */}
        <>

          <MDBTable>
            <MDBTableHead>
              <tr>
                <th scope='col'>Date</th>
                <th scope='col'>Number of Members</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {members && members.map((member) => {
                <div key={member.date}/>
                return (
                  <tr>
                    <td>{member.date}</td>
                    <td>{member.num}</td>
                  </tr>
                )
              }
              )}
        </MDBTableBody>
          </MDBTable>

          <MDBTable>
            <MDBTableHead>
              <tr>
                <th scope='col'>Date</th>
                <th scope='col'>Number of Posts</th>
              </tr>

            </MDBTableHead>
            <MDBTableBody>
              {posts && posts.map((post) => {
                <div key={post.date}/>
                return (
                  <tr>
                    <td>{post.date}</td>
                    <td>{post.num}</td>
                  </tr>
                )
              }
              )}
              {posts && posts.length === 0 &&
                
                <tr>
                  <td>No posts</td>
                  <td>No posts</td>
                  </tr>
                }


            </MDBTableBody>

          </MDBTable>

          <MDBTable>
            <MDBTableHead>
              <tr>
                <th scope='col'>Number of reported posts</th>
                <th scope='col'>Number of deleted posts</th>

              </tr>
            </MDBTableHead>
            <MDBTableBody>
              <tr>
                {reportstat &&
                <>
                <td>{reportstat.reported_posts_num}</td>
                <td>{reportstat.deleted_posts_num}</td>
                </>
                }

              </tr>
            </MDBTableBody>
          </MDBTable>
        </>
      {/* } */}







    </>
  )
}

export default Stats
