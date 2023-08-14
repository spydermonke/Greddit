import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt from 'jwt-decode';
import Navbar from './Navbar';

import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardHeader, MDBCardFooter, MDBContainer, MDBRow, MDBCol, MDBBtn } from 'mdb-react-ui-kit';

const SavedPosts = () => {

    let navigate = useNavigate()
    const [SavedPost, setSavedPost] = useState([])

    useEffect(() => {

        const Fetchdata = async () => {

            let token = localStorage.getItem("token");


            if (token) {
                let decoded_user = await jwt(token)
                let username = decoded_user.username;

                getSavedPost(username);



            }
            else {
                navigate("/auth?mode=login")
            }
        }
        Fetchdata();
        // is said to disble the warning of react hook dependency missing
        // eslint-disable-next-line
    }, []);

    const getSavedPost = async (username) => {

        let response = await fetch(`http://localhost:4000/savepost/getsavedpost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username
            }),
        });
        let data = await response.json();
        setSavedPost(data);

    }

    const removeSavedPost = async (post_id) => {
        let token = localStorage.getItem("token");
        let decoded_user = await jwt(token)
        let username = decoded_user.username;

        let response = await fetch(`http://localhost:4000/savepost/removesavedpost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "post_id": post_id
            }),
        });
        let data = await response.json();
        console.log(data);
        getSavedPost(username);
    }




    return (
        <>
            <Navbar></Navbar>

            <MDBContainer className="py-5 h-100 " >

                <div className="d-flex justify-content-evenly align-items-center h-100 flex-wrap">
                    {SavedPost && SavedPost.map((savedpost) =>
                        <div key={savedpost._id}>
                            {console.log(savedpost)}
                            <MDBCard className="shadow-0" style={{ maxWidth: '22rem' }}>
                                <MDBCardHeader className="text-center">
                                    <MDBCardTitle>{savedpost.title} </MDBCardTitle>
                                </MDBCardHeader>
                                <MDBCardBody>
                                    <MDBCardText>Belongs to Sub Greddit: {savedpost.subgreddit.name}</MDBCardText>   
                                    <MDBCardText>{savedpost.content}</MDBCardText>
                                    <MDBRow>
                                        <MDBCol>
                                            {savedpost.upvotes} Upvotes
                                        </MDBCol>
                                        <MDBCol>
                                            {savedpost.downvotes} Downvotes
                                        </MDBCol>
                                    </MDBRow>
                                </MDBCardBody>
                                <MDBCardFooter className="text-center">
                                    <MDBCardText>{savedpost.posted_by.username}</MDBCardText>
                                    <MDBBtn onClick={() => removeSavedPost(savedpost._id)}>Remove from Saved</MDBBtn>
                                </MDBCardFooter>
                            </MDBCard>
                        </div>
                    )}
                </div>

            </MDBContainer>

            {SavedPost.length === 0 && <div className="d-flex justify-content-center align-items-center h-100">
                <h1>No Saved Posts</h1>
                </div>}





        </>
    )
}

export default SavedPosts