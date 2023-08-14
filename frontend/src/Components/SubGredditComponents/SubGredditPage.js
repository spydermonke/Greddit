import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import NavbarModerator from './NavBarSubGreddit'
import jwt from 'jwt-decode'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardHeader, MDBCardFooter, MDBBtn, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import {
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
} from 'mdb-react-ui-kit';
import { MDBInput } from 'mdb-react-ui-kit';
import { MDBIcon } from 'mdb-react-ui-kit';
import { MDBAccordion, MDBAccordionItem } from 'mdb-react-ui-kit';



const SubGredditPage = () => {

    let navigate = useNavigate()
    let params = useParams();
    const [subGreddit, setSubGreddit] = useState([])
    const [posts, setPosts] = useState([])
    const [status, setStatus] = useState("")
    const [user, setUser] = useState([])


    useEffect(() => {

        const Fetchdata = async () => {

            let token = localStorage.getItem("token");
            let subgreddit_name = params.subgreddit_name;
            getSubGreddit(subgreddit_name);
            getPosts(subgreddit_name);
            if (token) {
                let decoded_user = await jwt(token)
                let username = decoded_user.username;
                setUser(decoded_user)

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
                setStatus(data.status)
                // console.log(status)

            }
            else {
                navigate("/auth?mode=login")
            }
        }
        Fetchdata();
        // is said to disble the warning of react hook dependency missing
        // eslint-disable-next-line
    }, []);

    const getSubGreddit = async (subgreddit_name) => {
        let respone = await fetch(`http://localhost:4000/subgreddit/info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "subgreddit_name": subgreddit_name
            }),
        });
        let data = await respone.json();
        setSubGreddit(data);
    }

    const getPosts = async (subgreddit_name) => {
        let respone = await fetch(`http://localhost:4000/posts/getposts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "subgreddit_name": subgreddit_name
            }),
        });
        let data = await respone.json();
        setPosts(data);
    }

    // const CreatePost = async () => {
    //     // e.preventDefault();
    //     let subgreddit_name = params.subgreddit_name;
    //     navigate(`/subgreddit/${subgreddit_name}/createpost`)
    // }

    const LeaveSubGreddit = async () => {
        let subgreddit_name = params.subgreddit_name;
        let response = await fetch(`http://localhost:4000/subgreddit/leave`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": user.username,
                "subgreddit_name": subgreddit_name
            }),
        });
        let data = await response.json();
        console.log(data);
        setStatus("blocked")

    }

    const JoinSubGreddit = async () => {
        let subgreddit_name = params.subgreddit_name;

        let response = await fetch(`http://localhost:4000/subgreddit/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "subgreddit_name": subgreddit_name
            }),
        });
        let data = await response.json();
        if (data.error) { }
        else {
            setStatus("requested")
        }

    }

    const JoinSubGredditBlocked = async () => {
        alert("You are blocked from this subgreddit")
    }

    const ReportPost = async (post_id) => {

        let subgreddit_name = params.subgreddit_name;

        navigate(`/subgreddit/${subgreddit_name}/reportpost/${post_id}`)
    }

    const SavedPost = async (post_id) => {

        let subgreddit_name = params.subgreddit_name;
        let token = localStorage.getItem("token");
        let decoded_user = await jwt(token)
        let username = decoded_user.username;

        let response = await fetch(`http://localhost:4000/savepost/savespost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "post_id": post_id,
                "subgreddit_name": subgreddit_name,

            }),
        });
        let data = await response.json();
        console.log(data);
    }

    const hideButton = (event) => {
        event.target.style.display = "none";
    }

    const FollowPoster = async (poster) => {
        // new stuff
        let token = localStorage.getItem("token");
        let decoded_user = await jwt(token)
        let username = decoded_user.username;
        const response = await fetch('http://localhost:4000/users/potential_followings/follow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                "username": username,
                "potential_following_username": poster
            })

        });
        let data = await response.json();
        localStorage.removeItem("token");
        localStorage.setItem("token", data.token);
    }

    const [basicModal, setBasicModal] = useState(false);

    const toggleShow = () => setBasicModal(!basicModal);

    const enableSubmit = (event) => {
        //Prevent page reload
        event.preventDefault();
        var { title, content } = document.forms[0];
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
        let subGreddit = params.subgreddit_name;
        let token = localStorage.getItem("token");
        let decoded_user = await jwt(token)
        setUser(decoded_user.username);

        const response = await fetch('http://localhost:4000/posts/createpost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                "title": title.value,
                "content": content.value,
                "posted_by": user,
                "subgreddit": subGreddit,
            })
        });

        let data = await response.json();

        if (data) {
            alert("New Post is Created")
            window.location.reload();
        }


    };

    const upVote = async (post_id) => {
        let token = localStorage.getItem("token");
        let decoded_user = await jwt(token)
        let username = decoded_user.username;

        let response = await fetch(`http://localhost:4000/subgreddit/upvote`, {
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
        window.location.reload();
    }

    const downVote = async (post_id) => {
        let token = localStorage.getItem("token");
        let decoded_user = await jwt(token)
        let username = decoded_user.username;

        let response = await fetch(`http://localhost:4000/subgreddit/downvote`, {
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
        window.location.reload();
    }

    const addcomment = async (post_id) => {

        let token = localStorage.getItem("token");
        let decoded_user = await jwt(token)
        let username = decoded_user.username;
        let comment = document.getElementById(post_id).value;

        if (comment === "" || comment === null) {
            alert("Comment cannot be empty")
            return;
        }
        let response = await fetch(`http://localhost:4000/subgreddit/addcomment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "post_id": post_id,
                "comment": comment
            }),
        });
        let data = await response.json();
        console.log(data);
        window.location.reload();
    }






    // /moderator
    return (

        // Moderator can view user list, edit reported page, edit joining requests, view stats
        // member can view ul,rp,jr,stats
        // blocked_user can view ul,rp,jr,stats
        // requested can view ul,rp,jr,stats
        // normal user can view ul,rp,jr,stats
        /* moderator can view post, create, follow */
        /* member can view post, create, leave, follow */
        /* blocked_user can view post */
        /* requested can view post asked to join */
        /* normal user can view post, can join */

        <>

            {status === "moderator" && subGreddit[0] &&
                <>

                    <NavbarModerator></NavbarModerator>
                    <>
                        <left>
                            <img src="https://th.bing.com/th/id/OIP.TcOUw74MyIYXUSYUrxbSYwHaEK?pid=ImgDet&rs=1" alt="subgreddit" width="200" height="200" />
                        </left>



                        <center>

                            <h1 >
                                {subGreddit[0].name}</h1>

                            <p>{subGreddit[0].description}</p>



                        </center>
                    </>



                    <MDBContainer className="py-5 h-100 " >

                        <div className="d-flex justify-content-evenly align-items-center h-100 flex-wrap">
                            {posts.map((post) =>
                                <div key={post._id}>

                                    <MDBCard className="shadow-0" style={{ maxWidth: '22rem' }}>
                                        <MDBCardHeader className="text-center">
                                            <MDBCardTitle>{post.title} </MDBCardTitle>
                                        </MDBCardHeader>
                                        <MDBCardBody>
                                            <MDBCardText>
                                                {post.content}
                                            </MDBCardText>
                                            <MDBRow>
                                                <MDBCol>
                                                    {post.upvotes} Upvotes
                                                    {
                                                        post.upvoted_by.filter((user1) => user1.username === user.username).length > 0
                                                            ?
                                                            <MDBBtn onClick={() => { upVote(post._id) }} >
                                                                <MDBIcon fas icon="caret-up" />Aready  Upvoted</MDBBtn>
                                                            :
                                                            <MDBBtn onClick={() => { upVote(post._id) }} > <MDBIcon fas icon="caret-up" /> Upvote</MDBBtn>
                                                    }

                                                </MDBCol>
                                                <MDBCol>
                                                    {post.downvotes} Downvotes
                                                    {
                                                        post.downvoted_by.filter((user1) => user1.username === user.username).length > 0
                                                            ?
                                                            <MDBBtn onClick={() => { downVote(post._id) }} > <MDBIcon fas icon="caret-down" />Already Downvoted</MDBBtn>
                                                            :
                                                            <MDBBtn onClick={() => { downVote(post._id) }} > <MDBIcon fas icon="caret-down" /> Downvote</MDBBtn>
                                                    }
                                                </MDBCol>
                                            </MDBRow>

                                            <br></br>

                                            <MDBAccordion>
                                                <MDBAccordionItem collapseId={1} headerTitle='Comments'>

                                                    <MDBRow>

                                                        {post.comments && post.comments.map((comment) =>
                                                            <div key={comment._id}>
                                                                <MDBRow>
                                                                    <MDBCol>
                                                                        {comment.posted_by.username} commented " {comment.content}"
                                                                    </MDBCol>
                                                                </MDBRow>

                                                            </div>
                                                        )}
                                                    </MDBRow>
                                                </MDBAccordionItem>
                                            </MDBAccordion>


                                            <br></br>

                                            <MDBRow>

                                                <MDBInput id={post._id} label="Add Comment" />
                                                <MDBBtn onClick={(event) => { addcomment(post._id); event.preventDefault() }} >Add Comment</MDBBtn>

                                            </MDBRow>




                                            <br></br>
                                            <MDBRow>
                                                <MDBBtn onClick={(event) => { ReportPost(post._id); hideButton(event) }} className='me-1' color='danger' >Report</MDBBtn>
                                            </MDBRow>
                                            <br></br>
                                            <MDBRow>
                                                <MDBBtn onClick={(event) => { SavedPost(post._id); hideButton(event) }} >Save</MDBBtn>
                                            </MDBRow>

                                        </MDBCardBody>
                                        <MDBCardFooter className="text-center">
                                            <MDBCardText>{post.posted_by.username}  <MDBBtn onClick={(event) => { FollowPoster(post.posted_by.username); hideButton(event) }}> Follow</MDBBtn>
                                            </MDBCardText>
                                        </MDBCardFooter>

                                    </MDBCard>
                                </div>
                            )}
                        </div>

                    </MDBContainer>

                    {posts.length === 0 &&

                        <center>
                            <h1>No posts to show</h1>
                        </center>

                    }

                    <center>
                        <MDBBtn onClick={toggleShow}>Create Post</MDBBtn>
                        <MDBModal show={basicModal} setShow={setBasicModal} tabIndex='-1'>
                            <MDBModalDialog>
                                <MDBModalContent>
                                    <MDBModalHeader>
                                        <MDBModalTitle>Create a new Post</MDBModalTitle>
                                        <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
                                    </MDBModalHeader>
                                    <MDBModalBody>
                                        <form onChange={enableSubmit} onSubmit={handleSubmit}>
                                            <MDBInput wrapperClass='mb-4' label='Title' id='title' type='text' />
                                            <MDBInput wrapperClass='mb-4' label='Content' id='content' type='text' />
                                            <MDBBtn className='w-100 mb-4' size='md' type='submit' id="submit" disabled onClick={toggleShow}> Create Post</MDBBtn>
                                        </form>
                                    </MDBModalBody>
                                </MDBModalContent>
                            </MDBModalDialog>
                        </MDBModal>
                    </center>
                </>
            }

            {
                status === "member" && subGreddit[0] &&
                <>
                    <NavbarModerator></NavbarModerator>
                    <left>
                        <img src="https://th.bing.com/th/id/OIP.TcOUw74MyIYXUSYUrxbSYwHaEK?pid=ImgDet&rs=1" alt="subgreddit" width="200" height="200" />
                    </left>

                    <center>

                        <h1 >
                            {subGreddit[0].name}</h1>

                        <p>{subGreddit[0].description}</p>


                    </center>

                    <MDBContainer className="py-5 h-100 " >

                        <div className="d-flex justify-content-evenly align-items-evenly h-100 flex-wrap">
                            {posts.map((post) =>
                                <div key={post._id}>

                                    <MDBCard className="shadow-0" style={{ maxWidth: '22rem' }}>
                                        <MDBCardHeader className="text-center">
                                            <MDBCardTitle>{post.title} </MDBCardTitle>
                                        </MDBCardHeader>
                                        <MDBCardBody>
                                            <MDBCardText>
                                                {post.content}
                                            </MDBCardText>
                                            <MDBRow>
                                                <MDBCol>
                                                    {post.upvotes} Upvotes
                                                    {post.upvoted_by.filter((user1) => user1.username === user.username).length > 0
                                                        ?
                                                        <MDBBtn onClick={() => { upVote(post._id) }} >
                                                            <MDBIcon fas icon="caret-up" /> Already Upvoted</MDBBtn>
                                                        :
                                                        <MDBBtn onClick={() => { upVote(post._id) }} > <MDBIcon fas icon="caret-up" /> Upvote</MDBBtn>
                                                    }

                                                </MDBCol>
                                                <MDBCol>
                                                    {post.downvotes} Downvotes
                                                    {post.downvoted_by.filter((user1) => user1.username === user.username).length > 0
                                                        ?
                                                        <MDBBtn onClick={() => { downVote(post._id) }} > <MDBIcon fas icon="caret-down" />Already Downvoted</MDBBtn>
                                                        :
                                                        <MDBBtn onClick={() => { downVote(post._id) }} > <MDBIcon fas icon="caret-down" /> Downvote</MDBBtn>
                                                    }
                                                </MDBCol>
                                            </MDBRow>
                                            <br></br>

                                            <MDBAccordion>
                                                <MDBAccordionItem collapseId={1} headerTitle='Comments'>

                                                    <MDBRow>

                                                        {post.comments && post.comments.map((comment) =>
                                                            <div key={comment._id}>
                                                                <MDBRow>
                                                                    <MDBCol>
                                                                        {comment.posted_by.username} commented " {comment.content}"
                                                                    </MDBCol>
                                                                </MDBRow>

                                                            </div>
                                                        )}
                                                    </MDBRow>
                                                </MDBAccordionItem>
                                            </MDBAccordion>


                                            <br></br>

                                            <MDBRow>

                                                <MDBInput id={post._id} label="Add Comment" />
                                                <MDBBtn onClick={(event) => { addcomment(post._id); event.preventDefault() }} >Add Comment</MDBBtn>

                                            </MDBRow>


                                            <br></br>
                                            <MDBRow>
                                                <MDBBtn onClick={(event) => { ReportPost(post._id); hideButton(event) }} className='me-1' color='danger'>Report</MDBBtn>
                                            </MDBRow>
                                            <br></br>
                                            <MDBRow>
                                                <MDBBtn onClick={(event) => { SavedPost(post._id); hideButton(event) }} >Save</MDBBtn>
                                            </MDBRow>

                                        </MDBCardBody>
                                        <MDBCardFooter className="text-center">
                                            {
                                                post.blocked === true ? <MDBCardText>Blocked User</MDBCardText> :
                                                    <MDBCardText>{post.posted_by.username}  <MDBBtn onClick={(event) => { FollowPoster(post.posted_by.username); hideButton(event) }}> Follow</MDBBtn>
                                                    </MDBCardText>
                                            }
                                        </MDBCardFooter>
                                    </MDBCard>
                                </div>
                            )}
                        </div>

                    </MDBContainer>

                    {posts.length === 0 &&

                        <center>
                            <h1>No posts to show</h1>
                        </center>

                    }
                    <center>
                        <MDBBtn onClick={toggleShow}>Create Post</MDBBtn>
                        <MDBModal show={basicModal} setShow={setBasicModal} tabIndex='-1'>
                            <MDBModalDialog>
                                <MDBModalContent>
                                    <MDBModalHeader>
                                        <MDBModalTitle>Create a new Post</MDBModalTitle>
                                        <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
                                    </MDBModalHeader>
                                    <MDBModalBody>
                                        <form onChange={enableSubmit} onSubmit={handleSubmit}>
                                            <MDBInput wrapperClass='mb-4' label='Title' id='title' type='text' />
                                            <MDBInput wrapperClass='mb-4' label='Content' id='content' type='text' />
                                            <MDBBtn className='w-100 mb-4' size='md' type='submit' id="submit" disabled onClick={toggleShow}> Create Post</MDBBtn>
                                        </form>
                                    </MDBModalBody>
                                </MDBModalContent>
                            </MDBModalDialog>
                        </MDBModal>
                    </center>
                    {/* leave button */}

                    <br></br>
                    <center>
                        <MDBBtn onClick={LeaveSubGreddit}>Leave Sub Greddit</MDBBtn>
                    </center>



                </>
            }
            {
                status === "blocked" && subGreddit[0] &&
                <>
                    <NavbarModerator></NavbarModerator>
                    <left>
                        <img src="https://th.bing.com/th/id/OIP.TcOUw74MyIYXUSYUrxbSYwHaEK?pid=ImgDet&rs=1" alt="subgreddit" width="200" height="200" />
                    </left>

                    <center>

                        <h1 >
                            {subGreddit[0].name}</h1>

                        <p>{subGreddit[0].description}</p>


                    </center>

                    <h2> You have been blocked by the moderator</h2>

                    <MDBContainer className="py-5 h-100 " >

                        <div className="d-flex justify-content-evenly align-items-evenly h-100 flex-wrap">
                            {posts.map((post) =>
                                <div key={post._id}>

                                    <MDBCard className="shadow-0" style={{ maxWidth: '22rem' }}>
                                        <MDBCardHeader className="text-center">
                                            <MDBCardTitle>{post.title} </MDBCardTitle>
                                        </MDBCardHeader>
                                        <MDBCardBody>
                                            <MDBCardText>
                                                {post.content}
                                            </MDBCardText>
                                            <MDBRow>
                                                <MDBCol>
                                                    {post.upvotes} Upvotes
                                                </MDBCol>
                                                <MDBCol>
                                                    {post.downvotes} Downvotes
                                                </MDBCol>
                                            </MDBRow>

                                            <br></br>

                                            <MDBAccordion>
                                                <MDBAccordionItem collapseId={1} headerTitle='Comments'>

                                                    <MDBRow>

                                                        {post.comments && post.comments.map((comment) =>
                                                            <div key={comment._id}>
                                                                <MDBRow>
                                                                    <MDBCol>
                                                                        {comment.posted_by.username} commented " {comment.content}"
                                                                    </MDBCol>
                                                                </MDBRow>

                                                            </div>
                                                        )}
                                                    </MDBRow>
                                                </MDBAccordionItem>
                                            </MDBAccordion>


                                            <br></br>


                                            {/* <MDBRow>
                            <MDBBtn onClick={(event) => { ReportPost(post._id); hideButton(event) }} >Report</MDBBtn>
                        </MDBRow>
                        <MDBRow>
                            <MDBBtn onClick={() => SavedPost(post._id)} >Save</MDBBtn>
                        </MDBRow> */}


                                        </MDBCardBody>
                                        <MDBCardFooter className="text-center">
                                            {post.blocked === true ? <MDBCardText>BLOCKED USER</MDBCardText> : <MDBCardText>{post.posted_by.username}</MDBCardText>}
                                        </MDBCardFooter>
                                    </MDBCard>
                                </div>
                            )}
                        </div>

                    </MDBContainer>

                    {posts.length === 0 &&

                        <center>
                            <h1>No posts to show</h1>
                        </center>

                    }

                    <center>
                        <MDBBtn onClick={JoinSubGredditBlocked}>Request to Join this Sub Greddit</MDBBtn>
                    </center>

                </>
            }
            {
                status === "requested" && subGreddit[0] &&
                <>
                    <NavbarModerator></NavbarModerator>
                    <left>
                        <img src="https://th.bing.com/th/id/OIP.TcOUw74MyIYXUSYUrxbSYwHaEK?pid=ImgDet&rs=1" alt="subgreddit" width="200" height="200" />
                    </left>

                    <center>

                        <h1 >
                            {subGreddit[0].name}</h1>

                        <p>{subGreddit[0].description}</p>


                    </center>

                    <MDBContainer className="py-5 h-100 " >

                        <div className="d-flex justify-content-evenly align-items-evenly h-100 flex-wrap">
                            {posts.map((post) =>
                                <div key={post._id}>

                                    <MDBCard className="shadow-0" style={{ maxWidth: '22rem' }}>
                                        <MDBCardHeader className="text-center">
                                            <MDBCardTitle>{post.title} </MDBCardTitle>
                                        </MDBCardHeader>
                                        <MDBCardBody>
                                            <MDBCardText>
                                                {post.content}
                                            </MDBCardText>
                                            <MDBRow>
                                                <MDBCol>
                                                    {post.upvotes} Upvotes
                                                </MDBCol>
                                                <MDBCol>
                                                    {post.downvotes} Downvotes
                                                </MDBCol>
                                            </MDBRow>
                                            {/* <MDBRow>
                                                <MDBBtn onClick={(event) => { ReportPost(post._id); hideButton(event) }} >Report</MDBBtn>
                                            </MDBRow>
                                            <MDBRow>
                                                <MDBBtn onClick={() => SavedPost(post._id)} >Save</MDBBtn>
                                            </MDBRow> */}

                                            <br></br>

                                            <MDBAccordion>
                                                <MDBAccordionItem collapseId={1} headerTitle='Comments'>

                                                    <MDBRow>

                                                        {post.comments && post.comments.map((comment) =>
                                                            <div key={comment._id}>
                                                                <MDBRow>
                                                                    <MDBCol>
                                                                        {comment.posted_by.username} commented " {comment.content}"
                                                                    </MDBCol>
                                                                </MDBRow>

                                                            </div>
                                                        )}
                                                    </MDBRow>
                                                </MDBAccordionItem>
                                            </MDBAccordion>


                                            <br></br>

                                        </MDBCardBody>
                                        <MDBCardFooter className="text-center">
                                            {post.blocked === true ? <MDBCardText>BLOCKED USER</MDBCardText> : <MDBCardText>{post.posted_by.username}</MDBCardText>}
                                        </MDBCardFooter>
                                    </MDBCard>
                                </div>
                            )}
                        </div>

                    </MDBContainer>

                    {posts.length === 0 &&

                        <center>
                            <h1>No posts to show</h1>
                        </center>

                    }

                    <center>
                        <h3> Request is Pending. Please wait</h3>
                    </center>

                    {/* Make button saying request is pending */}

                </>
            }
            {
                status === "normal_user" && subGreddit[0] &&
                <>
                    <NavbarModerator></NavbarModerator>
                    <left>
                        <img src="https://th.bing.com/th/id/OIP.TcOUw74MyIYXUSYUrxbSYwHaEK?pid=ImgDet&rs=1" alt="subgreddit" width="200" height="200" />
                    </left>

                    <center>

                        <h1 >
                            {subGreddit[0].name}</h1>

                        <p>{subGreddit[0].description}</p>


                    </center>

                    <MDBContainer className="py-5 h-100 " >

                        <div className="d-flex justify-content-evenly align-items-evenly h-100 flex-wrap">
                            {posts.map((post) =>
                                <div key={post._id}>

                                    <MDBCard className="shadow-0" style={{ maxWidth: '22rem' }}>
                                        <MDBCardHeader className="text-center">
                                            <MDBCardTitle>{post.title} </MDBCardTitle>
                                        </MDBCardHeader>
                                        <MDBCardBody>
                                            <MDBCardText>
                                                {post.content}
                                            </MDBCardText>
                                            <MDBRow>
                                                <MDBCol>
                                                    {post.upvotes} Upvotes
                                                </MDBCol>
                                                <MDBCol>
                                                    {post.downvotes} Downvotes
                                                </MDBCol>
                                            </MDBRow>
                                            {/* <MDBRow>
                                                <MDBBtn onClick={(event) => { ReportPost(post._id); hideButton(event) }} >Report</MDBBtn>
                                            </MDBRow>
                                            <MDBRow>
                                                <MDBBtn onClick={() => SavedPost(post._id)} >Save</MDBBtn>
                                            </MDBRow> */}

                                            <br></br>

                                            <MDBAccordion>
                                                <MDBAccordionItem collapseId={1} headerTitle='Comments'>

                                                    <MDBRow>

                                                        {post.comments && post.comments.map((comment) =>
                                                            <div key={comment._id}>
                                                                <MDBRow>
                                                                    <MDBCol>
                                                                        {comment.posted_by.username} commented " {comment.content}"
                                                                    </MDBCol>
                                                                </MDBRow>

                                                            </div>
                                                        )}
                                                    </MDBRow>
                                                </MDBAccordionItem>
                                            </MDBAccordion>


                                            <br></br>



                                        </MDBCardBody>
                                        <MDBCardFooter className="text-center">
                                            {post.blocked === true ? <MDBCardText>BLOCKED USER</MDBCardText> : <MDBCardText>{post.posted_by.username}</MDBCardText>}
                                        </MDBCardFooter>
                                    </MDBCard>
                                </div>
                            )}
                        </div>

                    </MDBContainer>

                    {posts.length === 0 &&

                        <center>
                            <h1>No posts to show</h1>
                        </center>

                    }

                    <center>
                        <MDBBtn onClick={JoinSubGreddit}>Request to Join this Sub Greddit</MDBBtn>
                    </center>

                    {/* Make follow button */}
                </>
            }
        </>
    )
}

export default SubGredditPage