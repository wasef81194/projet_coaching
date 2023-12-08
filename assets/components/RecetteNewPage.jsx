import React from 'react';
import NavBar from './modules/layout/NavBar';
import AuthCoach from './modules/AuthCoach';
import Auth from './modules/Auth';
import RecettesProfil from './modules/recette/Recettes';
import RecetteNew from './modules/recette/RecetteNew';

const RecetteNewPage = (props)=>{ 
    return (
        <div>
            <Auth></Auth>
            <AuthCoach></AuthCoach>
            <NavBar name="navbar-home"></NavBar>
            <RecetteNew></RecetteNew>
        </div>
    )
}
export default RecetteNewPage;
