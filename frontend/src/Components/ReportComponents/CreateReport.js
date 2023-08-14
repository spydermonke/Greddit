import React from 'react'
import Navbar from '../Navbar'
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCardText,
}
    from 'mdb-react-ui-kit';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react'
import jwt from 'jwt-decode'
import { useParams } from 'react-router-dom'

const CreatePostPage = () => {
    let navigate = useNavigate();
    let params = useParams();
    const [posts, setPost] = useState([]);
    
    // const [status, setStatus] = useState("")

    useEffect(() => {

        const Fetchdata = async () => {

            let token = localStorage.getItem("token");
            let subgreddit_name = params.subgreddit_name;
            let post_id = params.post_id;

            getPostContent(post_id);

            
            if (token) {
                let decoded_user = await jwt(token)
                let username = decoded_user.username;
                

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
                // console.log(data.status);
                // setStatus(data.status)

                if(data.status === "member" || data.status === "moderator"){
                    // navigate("/subgreddit")
                }
                else{
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

    const getPostContent = async (post_id) => {
        const response = await fetch(`http://localhost:4000/posts/getpostbyid`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "post_id": post_id
            }),
        });
        let data = await response.json();
        setPost(data);
        console.log(posts)
    
    }

    const enableSubmit = (event) => {
        //Prevent page reload
        event.preventDefault();
        var { reason } = document.forms[0];
        let btn = document.getElementById("submit");
        let isValid = true;
        if (reason.value === "" || reason.value === null) {
            isValid = false;
        }

       
    
        btn.disabled = !isValid;
    }
    
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        var { reason } = document.forms[0];

        let token = localStorage.getItem("token");
        let decoded_user = await jwt(token)
        let username = decoded_user.username;
        let post_id = params.post_id;
        let subgreddit_name = params.subgreddit_name;
        let reported_by = username;
        let in_subgreddit = subgreddit_name;
        let poster = posts.posted_by;
        let reported_post = post_id;
        let reason_for_report = reason.value;

        let respone = await fetch(`http://localhost:4000/report/createreport`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "reported_by_username": reported_by,
                "in_subgreddit": in_subgreddit,
                "poster": poster,
                "reported_post": reported_post,
                "reason": reason_for_report,
                "post_content": posts.content
            }),
        });
        let data = await respone.json();
        console.log(data);

        alert("Post has been reported")
    

    }
    
    
    return (
        <div>
            <center>
            <Navbar />
            <h1>Report Page</h1>

            

            
            {posts && <form onChange={enableSubmit} onSubmit={handleSubmit}>

                <MDBContainer fluid className='p-4'>

                    <MDBRow>

                        <MDBCol md='6'>

                            <MDBCard className='my-5 '>
                                <MDBCardBody className='p-5'>
                                    <MDBCardText>{posts.content}</MDBCardText>
                                    <MDBInput wrapperClass='mb-4' label='Concern with the Post' id='reason' type='text' />
                                    <MDBBtn className='w-100 mb-4' size='md' type='submit' id="submit" disabled> Report Post</MDBBtn>
                                </MDBCardBody>
                            </MDBCard>

                        </MDBCol>

                    </MDBRow>

                </MDBContainer>
            </form>
}
            </center>
    
        </div>
    )
}

export default CreatePostPage


