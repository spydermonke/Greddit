import { Navigate } from 'react-router-dom'
import React from 'react';

function Protected({ children }) {
  let token = localStorage.getItem("token");
  if (token) {
    return children
  }
  else{
    return <Navigate to="/auth?mode=login"/>

  }
}

export default Protected