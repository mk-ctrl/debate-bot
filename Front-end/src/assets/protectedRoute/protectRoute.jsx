import React from 'react'
import globalAuth from '../../zustand/auth.zustand'
import {Navigate} from 'react-router-dom'
const ProtectRoute = ({ children }) => {
  const token = globalAuth((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectRoute
