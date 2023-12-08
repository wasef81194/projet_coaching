import React from 'react';
import Coach from './modules/coach/Coach';
import NavBar from './modules/layout/NavBar';
import Auth from './modules/Auth';

const CoachPage = (props)=>{ 
    return (
        <div>
            <Auth></Auth>
            <NavBar name="navbar-home"></NavBar>
            <Coach></Coach>
        </div>
    )
}
export default CoachPage;
