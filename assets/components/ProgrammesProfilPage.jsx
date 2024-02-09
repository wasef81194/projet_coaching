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
            <div className="container-fluid">
                <h1>Vos Programmes</h1>
                <a href="#/new/programme" className="btn btn-primary"><i className="bi bi-plus-lg"></i> Nouveau Programme</a>
            </div>
            <Programmes myProgramme="1"></Programmes>
        </div>
    )
}
export default ProgrammesProfilPage;
