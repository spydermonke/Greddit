import React from 'react'
import Navbar from '../Navbar';
import { useState } from 'react';
import { useEffect } from 'react';
import { MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import jwt from 'jwt-decode';
import { useNavigate } from 'react-router-dom';


const FollowingPage = () => {

    let navigate = useNavigate();
    const [user_orginal, Setuser_org] = useState({});
    const [followings, setfollowing] = useState({});

    useEffect(() => {

        const fetchdata = async () => {

            let token = localStorage.getItem("token");
            if (token) {
                let decoded_user = await jwt(token)
                Setuser_org(decoded_user)
                console.log(user_orginal)
                getUserFollowing(decoded_user.username);
            }
            else {
                navigate("/auth?mode=login")
            }
        }


        fetchdata();
        // is said to disble the warning of react hook dependency missing
        // eslint-disable-next-line
    }, []);

    const getUserFollowing = async (username) => {
        const response = await fetch('http://localhost:4000/users/followings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                "username": username
            })
        });
        let data = await response.json();
        setfollowing(data);

    }

    const Unfollow = async (username, following_username) => {
        const response = await fetch('http://localhost:4000/users/followings/unfollow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                "username": username,
                "following_username": following_username
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
        <>
            <Navbar></Navbar>
            <div className="d-flex justify-content-center">
                <div className="btn-group shadow-0" role="group" aria-label="Basic example" >
                    <button
                        type="button"
                        className="  p-4 m-2 btn btn-outline-secondary"
                        onClick={() => { navigate('/profile/followers') }}>
                        Followers
                    </button>
                    <button
                        type="button"
                        className="  p-4 m-2 btn btn-outline-secondary"

                        onClick={() => { navigate('/profile/potential_followings') }} >
                        People To Follow
                    </button>
                </div>
            </div>
            <h3>You are following the followings:</h3>
            {followings.length > 0 && followings.map((followings) => <div key={followings.username}>
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
                                        <p className='fw-bold mb-1'>{followings.first_name + " " + followings.last_name}</p>

                                    </div>
                                </div>
                            </td>
                            <td>
                                <p className='fw-normal mb-1'>{followings.username}</p>

                            </td>
                            <td>
                                <MDBBtn color='link' rounded size='sm' onClick={(event) => { Unfollow(user_orginal.username, followings.username); hideButton(event) }}>
                                    Unfollow
                                </MDBBtn>
                            </td>
                        </tr>
                    </MDBTableBody>
                </MDBTable>
            </div>)}
            {followings.length === 0 && <h4>You follow no one</h4>}
        </>
    )
}

export default FollowingPage