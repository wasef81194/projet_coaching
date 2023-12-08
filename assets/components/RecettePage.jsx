import React from 'react';
import NavBar from './modules/layout/NavBar';
import Auth from './modules/Auth';
import Recette from './modules/recette/Recette';

const RecettePage= (props)=>{ 
    return (
        <div>
            <Auth></Auth>
            <NavBar name="navbar-home"></NavBar>
            <Recette></Recette>
        </div>
    )
}
export default RecettePage;
