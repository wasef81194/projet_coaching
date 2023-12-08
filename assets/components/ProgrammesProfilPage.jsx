import React from 'react';
import NavBar from './modules/layout/NavBar';
import AuthCoach from './modules/AuthCoach';
import Auth from './modules/Auth';
import Programmes from './modules/programme/Programmes';

const ProgrammesProfilPage = (props)=>{ 
    return (
        <div>
            <Auth></Auth>
            <AuthCoach></AuthCoach>
            <NavBar name="navbar-home"></NavBar>
            <Programmes myProgramme="1"></Programmes>
        </div>
    )
}
export default ProgrammesProfilPage;
