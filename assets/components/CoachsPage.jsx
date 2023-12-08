import React from 'react';
import Coachs from './modules/coach/Coachs';
import NavBar from './modules/layout/NavBar';

const CoachsPage = (props)=>{ 
    const coachId = props.match.params.id;
    return (
        <div>
            <NavBar name="navbar-home"></NavBar>
            <div className="container-fluid">
                <h1>Découvrez nos coachs</h1>
            </div>
            
            <Coachs showSearchInput={true}></Coachs>
        </div>
    )
}
export default CoachsPage;
