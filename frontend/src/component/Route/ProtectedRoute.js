import React from 'react'
import { useSelector } from 'react-redux';
import {Navigate} from "react-router-dom";
import Loader from '../loader/Loader';

const ProtectedRoute = ({isAdmin,children}) => {

    const {loading, isAuthenticated,user} = useSelector(state => state.user);

    if(loading || typeof loading == 'undefined' || typeof isAuthenticated == 'undefined'){
      return <Loader />
    }

    if(isAuthenticated === false){
      return <Navigate to="/login" />
    }

    if(isAdmin === true && user.role !== 'admin'){
      return <Navigate to="/account" />
    }

    return children;
  
}

export default ProtectedRoute


  // return (
  // <Fragment>{loading ? <Loader /> : (
  //     !isAuthenticated || (isAdmin === true && user.role !=="admin") ? <Navigate to="/login" /> : children
  //   )}</Fragment>
  // )


  // return (
  //   <Fragment>{loading ? <Loader /> : (isAuthenticated ?  children : <Navigate to="/login" />)}</Fragment>
  //   )