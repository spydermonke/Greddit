import React from 'react'
import Navbar from '../Navbar';
import { useState } from 'react';
import { useEffect } from 'react';
import { MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import jwt from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const PotentialFollowingPage = () => {
    let navigate = useNavigate();
    const [user_orginal, Setuser_org] = useState({});
    const [potential_followings, setpotential_followings] = useState({});

    useEffect(() => {

        const fetchdata = async () => {

            let token = localStorage.getItem("token");
            if (token) {
                let decoded_user = await jwt(token)
                Setuser_org(decoded_user)
                console.log(user_orginal)
                getPotentialFollowings(decoded_user.username);
            }
            else {
                navigate("/auth?mode=login")
            }
        }


        fetchdata();
        // is said to disble the warning of react hook dependency missing
        // eslint-disable-next-line
    }, []);

    const getPotentialFollowings = async (username) => {
        const response = await fetch('http://localhost:4000/users/potential_followings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                "username": username
            })
        });
        let data = await response.json();
        console.log(data)
        setpotential_followings(data);


    }

    const Follow = async (username, potential_following_username) => {
        const response = await fetch('http://localhost:4000/users/potential_followings/follow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                "username": username,
                "potential_following_username": potential_following_username
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
                        onClick={() => { navigate('/profile/followers') }}>
                        Followers
                    </button>
                    <button
                        type="button"
                        className="  p-4 m-2 btn btn-outline-secondary"
                        onClick={() => { navigate('/profile/followings') }} >
                        Followings
                    </button>
                </div>
            </div>
            <h3>People to follow:</h3>
            {potential_followings.length > 0 && potential_followings.map((potential_followings) => <div key={potential_followings.username}>
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
                                        <p className='fw-bold mb-1'>{potential_followings.first_name + " " + potential_followings.last_name}</p>

                                    </div>
                                </div>
                            </td>
                            <td>
                                <p className='fw-normal mb-1'>{potential_followings.username}</p>
                            </td>
                            <td>
                                <MDBBtn color='link' rounded size='sm' onClick={(event) => { Follow(user_orginal.username, potential_followings.username); hideButton(event) }}>
                                    Follow
                                </MDBBtn>
                            </td>
                        </tr>
                    </MDBTableBody>
                </MDBTable>
            </div>)}
            {potential_followings.length === 0 && <h4>You follow everyone</h4>}
        </div>
    )
}

export default PotentialFollowingPage