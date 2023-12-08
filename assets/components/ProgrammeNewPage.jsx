import React from 'react';
import NavBar from './modules/layout/NavBar';
import AuthCoach from './modules/AuthCoach';
import Auth from './modules/Auth';
import ProgrammeNew from './modules/programme/ProgrammeNew';
const ProgrammeNewPage = (props)=>{ 
    return (
        <div>
            <Auth></Auth>
            <AuthCoach></AuthCoach>
            <NavBar name="navbar-home"></NavBar>
            <div className="container-fluid">
            <h1>Vos programmes</h1>
                    <a href="#/new/programme" className="btn btn-primary"><i className="bi bi-plus-lg"></i> Nouveau programme</a>
            </div>
            <ProgrammeNew></ProgrammeNew>
        </div>
    )
}
export default ProgrammeNewPage;
