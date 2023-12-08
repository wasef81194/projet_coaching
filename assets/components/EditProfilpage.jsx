import React from 'react';
import NavBar from './modules/layout/NavBar';
import EditProfil from './modules/user/profil/EditProfil';
import Auth from './modules/Auth';
//import Profil from './modules/EditProfil';

const EditProfilPage = (props)=>{ 
    return (
        <div>
            <Auth></Auth>
            <NavBar name="navbar-home"></NavBar>
            <EditProfil></EditProfil>
        </div>
    )
}
export default EditProfilPage;
