import React from 'react';
import NavBar from './modules/layout/NavBar';
import Auth from './modules/Auth';
import AvisCoachNew from './modules/avis/AvisCoachNew';

const AvisCoachNewPage = (props)=>{ 
    return (
        <div>
            <Auth></Auth>
            <NavBar name="navbar-home"></NavBar>
            <AvisCoachNew></AvisCoachNew>
        </div>
    )
}
export default AvisCoachNewPage;
