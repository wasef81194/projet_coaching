import React from 'react';
import NavBar from './modules/layout/NavBar';
import AuthCoach from './modules/AuthCoach';
import Auth from './modules/Auth';
import Recettes from './modules/recette/Recettes';

const RecettesProfilPage = (props)=>{ 
    return (
        <div>
            <Auth></Auth>
            <AuthCoach></AuthCoach>
            <NavBar name="navbar-home"></NavBar>
            <div className="container-fluid">
                <h1>Vos recettes</h1>
                <a href="#/new/recette" className="btn btn-primary"><i className="bi bi-plus-lg"></i> Nouvelle recette</a>
            </div>
            <Recettes myRecette="1"></Recettes>
        </div>
    )
}
export default RecettesProfilPage;
