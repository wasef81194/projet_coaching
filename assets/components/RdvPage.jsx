import React from 'react';
import NavBar from './modules/layout/NavBar';
import Auth from './modules/Auth';
import Rdvs from './modules/reservation/Rdvs';

const RdvPage = (props)=>{ 
    return (
        <div>
            <Auth></Auth>
            <NavBar name="navbar-home"></NavBar>
            <Rdvs></Rdvs>
        </div>
    )
}
export default RdvPage;
