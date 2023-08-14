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
    const [subGreddit, setSubGreddit] = useState([])
    const [user, setUser] = useState( [])
    // const [status, setStatus] = useState("")

    useEffect(() => {

        const Fetchdata = async () => {

            let token = localStorage.getItem("token");
            let subgreddit_name = params.subgreddit_name;
            setSubGreddit(subgreddit_name);

            
            if (token) {
                let decoded_user = await jwt(token)
                let username = decoded_user.username;
                setUser(decoded_user);

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

                if(data.status === "member" || data.status === "moderator" ){
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

    const enableSubmit = (event) => {
        //Prevent page reload
        event.preventDefault();
        var { title , content } = document.forms[0];
        let btn = document.getElementById("submit");
        let isValid = true;
        if (title.value === "" || title.value === null) {
            isValid = false;
        }
        if (content.value === "" || content.value === null) {
            isValid = false;
        }
       
    
        btn.disabled = !isValid;
    }
    
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        var { title, content } = document.forms[0];
    
    
       

        console.log(user)
        console.log(subGreddit)

        const response = await fetch('http://localhost:4000/posts/createpost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                "title": title.value,
                "content": content.value,
                "posted_by":user,
                "subgreddit":subGreddit,
            })
        });

        let data = await response.json();

        if (data) {
            alert("New Post is Created")
        }    
    
    
    };
    
    return (
        <div>
            <Navbar />
            <h1>Create Post Page</h1>

            
            <form onChange={enableSubmit} onSubmit={handleSubmit}>

                <MDBContainer fluid className='p-4'>

                    <MDBRow>

                        <MDBCol md='6'>

                            <MDBCard className='my-5 '>
                                <MDBCardBody className='p-5'>
                                    <MDBInput wrapperClass='mb-4' label='Title' id='title' type='text' />
                                    <MDBInput wrapperClass='mb-4' label='Content' id='content' type='text' />
                                    <MDBBtn className='w-100 mb-4' size='md' type='submit' id="submit" disabled> Create Post</MDBBtn>
                                </MDBCardBody>
                            </MDBCard>

                        </MDBCol>

                    </MDBRow>

                </MDBContainer>
            </form>
        </div>
    )
}

export default CreatePostPage


