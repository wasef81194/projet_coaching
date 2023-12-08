import React from 'react';
import FormLogin from './modules/user/FormLogin';
import NavBar from './modules/layout/NavBar';

const LoginPage = (props)=>{ 
    return (
        <div>
            <NavBar name="navbar-home"></NavBar>
            <FormLogin></FormLogin>
        </div>
    )
}
export default LoginPage;
