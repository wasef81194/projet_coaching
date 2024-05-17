import React from 'react';
import FormLogin from './modules/user/FormLogin';
import NavBar from './modules/layout/NavBar';

const LoginPage = (props)=>{ 
    return (
        <div className="login-page">
            <NavBar name="navbar-home"></NavBar>
            <FormLogin className="d-flex jusitfy-center align-center h-75"></FormLogin>
        </div>
    )
}
export default LoginPage;
