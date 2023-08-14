import React from 'react'
import Navbar from '../Navbar';
import { useNavigate } from 'react-router-dom';
import {
  MDBInput,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from 'mdb-react-ui-kit';

import { useState } from 'react';
import { useEffect } from 'react';
import jwt from 'jwt-decode';

const CreateSubGredditPage = () => {

  let navigate = useNavigate()

  const [user_orginal, Setuser_org] = useState({});

  useEffect(() => {

    const fetchdata = async () => {

        let token = localStorage.getItem("token");
        if (token) {
            let decoded_user = await jwt(token)
            Setuser_org(decoded_user);
        }
        else {
            navigate("/auth?mode=login")
        }
    }


    fetchdata();
    // is said to disble the warning of react hook dependency missing
    // eslint-disable-next-line
}, []);

  const enableSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();
    var { name, description } = document.forms[0];
    let btn = document.getElementById("submit");
    let isValid = true;
    if (name.value === "" || name.value === null) {
      isValid = false;
    }
    if (description.value === "" || description.value === null) {
      isValid = false;
    }

    btn.disabled = !isValid;
  }

  const handleSubmit = async (event) => {


    //Prevent page reload
    event.preventDefault();  
    var { name, description } = document.forms[0];


    const response = await fetch('http://localhost:4000/subgreddit/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',

      },
      body: JSON.stringify({
        "name": name.value,
        "description": description.value,
        "tags": tags_list,
        "banned_keywords": bannedKeywords,
        "moderator": user_orginal,
      })
    });

    let data = await response.json();
    
    if (data.error) {
      alert(data.error)
    }
    else {
      // alert("Login Successful")
      // navigate('/home')
      alert("Subgreddit Created")

    }
  }

  const [tags_list, setTags] = useState([]);
  const [bannedKeywords, setBannedKeywords] = useState([]);

  const AddBannedKeyword = () => {
    var { banned_keywords } = document.forms[0];
    if (banned_keywords.value === "" || banned_keywords.value === null) {
      return;
    }
    setBannedKeywords([...bannedKeywords, banned_keywords.value]);
    banned_keywords.value = "";
  }

  const AddTag = () => {
    var { tags } = document.forms[0];
    if (tags.value === "" || tags.value === null) {
      return;
    }
    tags.value = tags.value.toLowerCase();
    setTags([...tags_list, tags.value]);
    tags.value = "";
  }

  const removeTag = (tag) => {
    setTags(tags_list.filter((t) => t !== tag));



  }

  const removeBannedKeyword = (bannedKeyword) => {
    setBannedKeywords(bannedKeywords.filter((b) => b !== bannedKeyword));
  }

  const hideButton = (event) => {
    event.target = "none";
  }

  return (
    <div>

      <Navbar></Navbar>

      <div className="d-flex justify-content-center">
        <div className="btn-group shadow-0" role="group" aria-label="Basic example" >
          <button
            type="button"
            className="  p-4 m-2 btn btn-outline-secondary"
            onClick={() => { navigate('/subgreddit/mysubgreddits') }}>
            My Sub Greddits
          </button>
          <button
            type="button"
            className="  p-4 m-2 btn btn-outline-secondary"
            onClick={() => { navigate('/subgreddit/allsubgreddits') }} >
            All Sub Greddits
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} onChange={enableSubmit} className='text-center text-md-start d-flex flex-column justify-content-center'>

        {/*  to input : name, description, tags, banned keywords */}
        {/*  known: moderator */}

        <MDBCard className='my-5'>
          <MDBCardBody className='p-5'>


            <MDBInput wrapperClass='mb-4' label='Name of the New Greddit' id='name' type='text' />
            <MDBInput wrapperClass='mb-4' type="text" id='description' label='Description' />

            <MDBRow>
              <MDBCol col='6'>
                <MDBInput wrapperClass='mb-4' label='Tags' id='tags' type='text' />
                <MDBBtn className='w-100 mb-4' size='md' type='button' id="addtag" onClick={AddTag} >Add Tag</MDBBtn>
                {tags_list.map((tag) => {

                  return (
                    <div className="d-flex justify-content-between">
                      <p>{tag}</p>
                      <button type="button" className="btn-close" aria-label="Close" onClick={(event) => { removeTag(tag); hideButton(event) }}></button>
                    </div>
                  )
                })}

              </MDBCol>
              <MDBCol col='6'>
                <MDBInput wrapperClass='mb-4' label='Banned Keywords' id='banned_keywords' type='text' />
                <MDBBtn className='w-100 mb-4' size='md' type='button' id="addbannedkeyword" onClick={AddBannedKeyword} >Add Banned Keyword</MDBBtn>
                {bannedKeywords.map((keyword) => {

                  return (
                    <div className="d-flex justify-content-between">
                      <p>{keyword}</p>
                      <button type="button" className="btn-close" aria-label="Close" onClick={(event) => { removeBannedKeyword(keyword); hideButton(event) }}></button>
                    </div>
                  )
                })}

              </MDBCol>
            </MDBRow>

            <MDBBtn className='w-100 mb-4' size='md' type='submit' id="submit" disabled>Make New Sub Greddit</MDBBtn>

          </MDBCardBody>
        </MDBCard>
      </form>

    </div>
  )
}

export default CreateSubGredditPage




