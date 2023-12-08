import React from 'react';
import FormRegister from './modules/user/FormRegister';
import NavBar from './modules/layout/NavBar';

const RegisterPage = (props)=>{ 
    return (
        <div>
            <NavBar name="navbar-home"></NavBar>
            <FormRegister></FormRegister>
        </div>
    )
}
export default RegisterPage;
