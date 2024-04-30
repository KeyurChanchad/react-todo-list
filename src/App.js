import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const App = ()=> {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={ <HomePage />} />
        <Route exact path='/login' element={<LoginPage />} />
        <Route exact path='/signup' element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;