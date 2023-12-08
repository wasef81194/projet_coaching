import React from 'react';
import NavBar from './modules/layout/NavBar';
import Profil from './modules/user/profil/Profil';
import Auth from './modules/Auth';

const ProfilPage = (props)=>{ 
    return (
        <div>
            <Auth></Auth>
            <NavBar name="navbar-home"></NavBar>
            <Profil></Profil>
        </div>
    )
}
export default ProfilPage;
