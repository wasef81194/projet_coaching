import React from 'react';
import NavBar from './modules/layout/NavBar';
import Auth from './modules/Auth';
import Recettes from './modules/recette/Recettes';

const RecettesPage = (props)=>{ 
    return (
        <div>
            <Auth></Auth>
            <NavBar name="navbar-home"></NavBar>
            <div className="container-fluid">
                <h1>Découvrez de nouvelle recettes</h1>
            </div>
            <Recettes></Recettes>
        </div>
    )
}
export default RecettesPage;
