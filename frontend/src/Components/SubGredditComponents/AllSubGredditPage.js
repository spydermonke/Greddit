import React from 'react'
import Navbar from '../Navbar'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import Fuse from 'fuse.js'
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardHeader,
  MDBCardFooter,
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInputGroup,
  MDBInput,
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from 'mdb-react-ui-kit';

import jwt from 'jwt-decode';



const AllSubGredditPage = () => {

  let navigate = useNavigate()

  useEffect(() => {

    let token = localStorage.getItem("token");
    if (token) {
      let decoded_user = jwt(token)
      let username = decoded_user.username;

     allSubGreddits(username);
    }
    // is said to disble the warning of react hook dependency missing
    // eslint-disable-next-line
  }, [])

  const [subGreddits, setSubGreddits] = useState([])
  const [sort, setSort] = useState("")
  const [search, setSearch] = useState([] )

  const options = {

    keys: [
      'name',
      'description',
      'banned_keywords',
    ]
  }

  const allSubGreddits = async (username) => {
    const response = await fetch('http://localhost:4000/subgreddit/allsubgreddits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "username": username,
      }),
    });
    const data = await response.json();
    setSubGreddits(data);
    setSearch(data)
     
  }

  const changeResult = (query) => {
    if(query === ""){
      setSearch(subGreddits)
    }
    else{
    const fuse = new Fuse(subGreddits, options) 
    const result = fuse.search(query)
    setSearch((result.map((item) => item.item)))
    }
  }
  
  return (
    <>
      <Navbar></Navbar>
      <div className="d-flex justify-content-center">
        <div className="btn-group shadow-0" role="group" aria-label="Basic example" >
          <button
            type="button"
            className="  p-4 m-2 btn btn-outline-secondary"
            onClick={() => { navigate('/subgreddit/create') }}>
            Create a New Subgreddit
          </button>
          <button
            type="button"
            className="  p-4 m-2 btn btn-outline-secondary"
            onClick={() => { navigate('/subgreddit/mysubgreddits') }} >
            My Sub Greddits
          </button>
        </div>
      </div>


      <MDBContainer className="py-5 h-100 " >

        <MDBInputGroup>
          <MDBInput label='Search' onChange={(event) => {changeResult(event.target.value)}} />
          <MDBBtn rippleColor='dark'>
            <MDBIcon icon='search' />
          </MDBBtn>
        </MDBInputGroup>

        <br></br>

        <MDBDropdown>
          <MDBDropdownToggle> Sort</MDBDropdownToggle>
          <MDBDropdownMenu>
            <MDBDropdownItem>
              <MDBBtn onClick={() => setSort("name_ascending")}>Name (Ascending)
              </MDBBtn>
            </MDBDropdownItem>
            <MDBDropdownItem>
              <MDBBtn onClick={() => setSort("name_descending")}>Name (Descending)
              </MDBBtn>
            </MDBDropdownItem>
            <MDBDropdownItem>
              <MDBBtn onClick={() => setSort("created_at")}>Created At
              </MDBBtn>
            </MDBDropdownItem>
            <MDBDropdownItem>
              <MDBBtn onClick={() => setSort("followers")}>Followers
              </MDBBtn>
            </MDBDropdownItem>
            <MDBDropdownItem>
              <MDBBtn onClick={() => setSort("")}>Remove Sorting
              </MDBBtn>
            </MDBDropdownItem>

          </MDBDropdownMenu>
        </MDBDropdown>

        <br></br>


        <div className="d-flex justify-content-evenly align-items-center h-100 flex-wrap">
          
          {       
          search.sort(
            (a, b) => {
              if (sort === "name_ascending") {
                return a.name.localeCompare(b.name);
              } else if (sort === "name_descending") {
                return b.name.localeCompare(a.name);
              } else if (sort === "created_at") {
                return b.createdAt.localeCompare(a.createdAt);
              } else if (sort === "followers") {
                return b.members_num - a.members_num;
              } else {
                return null;
              }
            }
          )
            .map((subGreddit) =>
              <div key={subGreddit.name}>

                <MDBCard className="shadow-0" style={{ maxWidth: '22rem' }}>
                  <MDBCardHeader className="text-center">
                    <MDBCardTitle>{subGreddit.name}</MDBCardTitle>
                  </MDBCardHeader>
                  <MDBCardBody>
                    <MDBCardText>
                      {subGreddit.description}
                    </MDBCardText>
                    <MDBRow>
                      <MDBCol>
                        {subGreddit.members_num} Members
                      </MDBCol>
                      <MDBCol>
                        {subGreddit.posts_num} Posts
                      </MDBCol>
                    </MDBRow>
                    <MDBCardText>Banned Keywords are:</MDBCardText>
                    <MDBRow>
                      {subGreddit.banned_keywords.map((keyword, i) => [
                        i > 0 && ",",
                        <MDBCol key={i}>
                          {keyword}
                        </MDBCol>
                      ])}
                    </MDBRow>
                  </MDBCardBody>
                  <MDBCardFooter className="text-center">
                    <MDBBtn color="primary" onClick={() => { navigate(`/subgreddit/${subGreddit.name}`) }}>View</MDBBtn>
                  </MDBCardFooter>
                </MDBCard>
              </div>



            )}
        </div>

      </MDBContainer>

      {subGreddits.length === 0 && <div className="d-flex justify-content-center"> <h1> No SubGreddits to show </h1> </div>}

    </>
  )
}

export default AllSubGredditPage