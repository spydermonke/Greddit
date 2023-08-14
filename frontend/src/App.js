import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Authentication from './Components/Authentication';
import FollowersPage from './Components/FollowComponents/FollowersPage';
import FollowingPage from './Components/FollowComponents/FollowingPage';
import PotentialFollowingPage from './Components/FollowComponents/PotentialFollowingPage';
import Profile from "./Components/Profile";
import Protected from './Components/Protected';
import SubGredditPage from './Components/SubGredditComponents/SubGredditPage';
import CreateSubGredditPage from './Components/SubGredditComponents/CreateSubGredditPage';
import MySubGredditPage from './Components/SubGredditComponents/MySubGredditPage';
import AllSubGredditPage from './Components/SubGredditComponents/AllSubGredditPage';
import CreatePostPage from './Components/PostComponents/CreatePostPage';
import UserList from './Components/ModeratorComponents/UserList';
import JoiningRequests from './Components/ModeratorComponents/Joining_Requests';
import Stats from './Components/ModeratorComponents/Stats';
import CreateReport from './Components/ReportComponents/CreateReport';
import ReportedPage from './Components/ModeratorComponents/ReportedPage';
import SavedPosts from './Components/SavedPosts';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/auth" element={<Authentication />} />
          <Route
            path="/profile"
            element={
              <Protected children={<Profile />}></Protected>
            }></Route>
          <Route
            path="/profile/followers"
            element={
              <Protected children={<FollowersPage />}></Protected>
            }></Route>
          <Route
            path="/profile/followings"
            element={
              <Protected children={<FollowingPage />}></Protected>
            }></Route>
          <Route
            path="/profile/potential_followings"
            element={
              <Protected children={<PotentialFollowingPage />}></Protected>
            }></Route>
            <Route 
            path="/subgreddit"
            element={
              <Protected children={<MySubGredditPage />}></Protected>
            }></Route>
            <Route
            path="/subgreddit/create"
            element={
              <Protected children={<CreateSubGredditPage />}></Protected>
            }></Route>
            <Route
            path="/subgreddit/mysubgreddits"
            element={
              <Protected children={< MySubGredditPage />}></Protected>
            }></Route>
            <Route
            path="/subgreddit/allsubgreddits"
            element={
              <Protected children={<AllSubGredditPage />}></Protected>
            }></Route>
            <Route 
            path="/subgreddit/:subgreddit_name"
            element={
              <Protected children={<SubGredditPage />}></Protected>
            }></Route>
            <Route 
            path="/subgreddit/:subgreddit_name/createpost"
            element={
              <Protected children={<CreatePostPage />}></Protected>
            }></Route>
            <Route
            path="/subgreddit/:subgreddit_name/user_list"
            element={
              <Protected children={<UserList />}></Protected>
            }></Route>
            <Route
            path="/subgreddit/:subgreddit_name/joining_requests"
            element={
              <Protected children={<JoiningRequests />}></Protected>
              // eslint-disable-next-line
            }></Route>
            <Route
            path="/subgreddit/:subgreddit_name/stats"
            element={
              <Protected children={<Stats />}></Protected>
            }></Route>
            <Route 
            path="/subgreddit/:subgreddit_name/reportpost/:post_id"
            element={
              <Protected children={<CreateReport />}></Protected>
            }></Route>
            <Route
            path="/subgreddit/:subgreddit_name/reported"
            element={
              <Protected children={<ReportedPage />}></Protected>
            }></Route>
            <Route
            path='/savedposts'
            element={
              <Protected children={<SavedPosts />}></Protected>
            }></Route>
            <Route path="/" element={<Authentication />}></Route>
            <Route path="*" element={<Authentication />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
