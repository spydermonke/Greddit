import React, { useState } from 'react';
// eslint-disable-next-line
import {
  MDBContainer,
  MDBNavbar,
  // eslint-disable-next-line
  MDBNavbarBrand,
  // eslint-disable-next-line
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
  MDBIcon
} from 'mdb-react-ui-kit';
// eslint-disable-next-line

import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';



const NavbarModerator = () => {

  const [subgreddit_name, setSubgredditName] = useState("")

  const params = useParams();
  useEffect (() => {
    let subgreddit_name = params.subgreddit_name;
    setSubgredditName(subgreddit_name);
    // eslint-disable-next-line
  }, [])

  const [showNav, setShowNav] = useState(false);

  let navigate = useNavigate();

  const Signout = () => {
    localStorage.removeItem("token");
    navigate("/auth?mode=login");
  };

  return (
    <MDBNavbar expand='lg' light bgColor='light'>
      <MDBContainer fluid>
        <MDBNavbarBrand >Greddit</MDBNavbarBrand>
        <MDBNavbarToggler
          type='button'
          aria-expanded='false'
          aria-label='Toggle navigation'
          onClick={() => setShowNav(!showNav)}
        >
          <MDBIcon icon='bars' fas />
        </MDBNavbarToggler>
        <MDBCollapse navbar show={showNav}>
          <MDBNavbarNav>
            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page' href='/profile'>
                Home <MDBIcon fas icon="home" />
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page'  href= {'/subgreddit/' + subgreddit_name + '/user_list' }>
                Users Lists <MDBIcon fas icon="bars" />
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page'  href= {'/subgreddit/' + subgreddit_name + '/joining_requests' } >
                Joining Requests <MDBIcon fas icon="bars" />
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page'  href= {'/subgreddit/' + subgreddit_name + '/stats' } >
                Stats <MDBIcon fas icon="signal" />
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page'  href= {'/subgreddit/' + subgreddit_name + '/reported' } >
                Reported Page <MDBIcon fas icon="flag" />
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page' href='/savedposts' >
                My Saved Posts <MDBIcon fas icon="book" />
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page' href='/subgreddit/mysubgreddits' >
                My SubGreddits <MDBIcon fab icon="docker" />
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink onClick={Signout}>
                Sign Out <MDBIcon fas icon="key" />
                </MDBNavbarLink>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}

export default NavbarModerator;