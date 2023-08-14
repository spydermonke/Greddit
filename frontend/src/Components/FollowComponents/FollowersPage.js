import React from 'react'
import Navbar from '../Navbar';
import { useState } from 'react';
import { useEffect } from 'react';
import { MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import jwt from 'jwt-decode';
import { useNavigate } from 'react-router-dom';


const FollowersPage = () => {

    let navigate = useNavigate();
    const [user_orginal, Setuser_org] = useState({});
    const [followers, setfollowers] = useState({});

    useEffect(() => {

        const fetchdata = async () => {

            let token = localStorage.getItem("token");
            if (token) {
                let decoded_user = await jwt(token)
                Setuser_org(decoded_user)
                console.log(user_orginal)
                getUserFollowers(decoded_user.username);
            }
            else {
                navigate("/auth?mode=login")
            }
        }


        fetchdata();
        // is said to disble the warning of react hook dependency missing
        // eslint-disable-next-line
    }, []);

    const getUserFollowers = async (username) => {

        const response = await fetch('http://localhost:4000/users/followers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                "username": username
            })
        });
        let data = await response.json();
        setfollowers(data);
    }

    const Remove = async (username, followers_username) => {
        const response = await fetch('http://localhost:4000/users/followers/remove', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                "username": username,
                "followers_username": followers_username
            })
        });
        let data = await response.json();

        localStorage.removeItem("token");
        localStorage.setItem("token", data.token);




    }


    const hideButton = (event) => {
        event.target.style.display = "none";
    }

    return (
        <div>
            <Navbar></Navbar>
            <div className="d-flex justify-content-center">
                <div className="btn-group shadow-0" role="group" aria-label="Basic example" >
                    <button
                        type="button"
                        className="  p-4 m-2 btn btn-outline-secondary"
                        onClick={() => { navigate('/profile/followings') }}>
                        Followings
                    </button>
                    <button
                        type="button"
                        className="  p-4 m-2 btn btn-outline-secondary"
                        onClick={() => { navigate('/profile/potential_followings') }} >
                        People To Follow
                    </button>
                </div>
            </div>
            <h3>You are being followed by the followings:</h3>
            {followers.length > 0 && followers.map((followers) => <div key={followers.username}>

                <MDBTable align='middle'>
                    <MDBTableHead>
                        <tr>
                            <th scope='col'>Name</th>
                            <th scope='col'>Username</th>
                            <th scope='col'>Actions</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        <tr>
                            <td>
                                <div className='d-flex align-items-center'>
                                    <div className='ms-3'>
                                        <p className='fw-bold mb-1'>{followers.first_name + " " + followers.last_name}</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <p className='fw-normal mb-1'>{followers.username}</p>
                            </td>
                            <td>
                                <MDBBtn color='link' rounded size='sm' onClick={(event) => { Remove(user_orginal.username, followers.username); hideButton(event) }}>
                                    Remove from Followers
                                </MDBBtn>
                            </td>
                        </tr>
                    </MDBTableBody>
                </MDBTable>

            
            </div>)}
            {followers.length === 0 && <h4>You are followed by no one</h4>}
        </div>
    )
}

export default FollowersPage