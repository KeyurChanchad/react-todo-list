import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const App = ()=> {
  return (
    <HashRouter>
      <Routes>
        <Route exact path='/' element={ <HomePage />} />
        <Route exact path='/login' element={<LoginPage />} />
        <Route exact path='/signup' element={<SignupPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App;