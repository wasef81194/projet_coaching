import React from 'react';
import NavBar from './modules/layout/NavBar';
import Auth from './modules/Auth';
import AvisNew from './modules/avis/AvisNew';

const AvisNewPage = (props)=>{ 
    return (
        <div>
            <Auth></Auth>
            <NavBar name="navbar-home"></NavBar>
            <AvisNew></AvisNew>
        </div>
    )
}
export default AvisNewPage;
