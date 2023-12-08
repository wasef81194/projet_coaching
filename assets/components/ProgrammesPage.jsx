import React from 'react';
import NavBar from './modules/layout/NavBar';
import Auth from './modules/Auth';
import Programmes from './modules/programme/Programmes';

const ProgrammesPage = (props)=>{ 
    return (
        <div>
            <Auth></Auth>
            <NavBar name="navbar-home"></NavBar>
            <div className="container-fluid">
                <h1>Découvrez de nouveau programme</h1>
            </div>
            <Programmes></Programmes>
        </div>
    )
}
export default ProgrammesPage;
