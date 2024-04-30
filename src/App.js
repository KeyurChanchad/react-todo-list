import React, { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

const App = ()=> {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check authentication status when the component mounts
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // get cookie value
      const authToken = getCookie('authToken');
      if (authToken) {
        setLoggedIn(true);
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
    }
  };

  const getCookie = (cname)=> {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={loggedIn ? <HomePage /> : <Navigate to={'/login'} replace={true} />} />
        <Route exact path='/login' element={loggedIn ? <Navigate to={'/'} replace={true} /> : <LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;