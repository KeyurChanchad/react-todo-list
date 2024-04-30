// LoginPage.js

import React, { useState } from 'react';
import axios from 'axios';
import baseUrl from '../config';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password === cpassword) {
        // Send singup request to backend
      const response = await axios.post(`${baseUrl}/api/auth/signup`, { username, password });
      console.log('REspose ', response.data);
      
      if (response.data.success) {
        setError('');
        setCookie('authToken', response.data.token, 1);
        navigate('/');
      }else {
        setError("Invalid username or password.");
      }
      } else {
        setError('Password and confirm password must be same.')
      }
      
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };
  
  const setCookie = (cname, cvalue, exdays)=> {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  return (
    <div className='container my-5 w-50'>
      <h1 className='text-center'>{'Sing up'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <label htmlFor="username" className="form-label">{'Username'}</label>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" id="username" />
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label">{'Password'}</label>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="password" />
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label">{'Confirm password'}</label>
            <input type="password" placeholder="Password" value={cpassword} onChange={(e) => setCPassword(e.target.value)} className="form-control" id="password" />
        </div>
        <Link className="d-block text-end text-primary" to='/login'>{"Already have an account? Login"} </Link>
        <div id="error" className="text-end text-danger">{error}</div>
        <button type="submit" className="btn btn-primary">{'Submit'}</button>
      </form>
    </div>
  );
};

export default SignupPage;
