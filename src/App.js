import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

const App = ()=> {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={ <HomePage />} />
        <Route exact path='/login' element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;