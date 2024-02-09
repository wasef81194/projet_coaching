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
            <ProgrammeNew></ProgrammeNew>
        </div>
    )
}
export default ProgrammeNewPage;
