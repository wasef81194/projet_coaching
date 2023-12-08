import React from 'react';
import NavBar from './modules/layout/NavBar';
import Auth from './modules/Auth';
import Reservations from './modules/reservation/Reservations';

const ReservationsPage = (props)=>{ 
    return (
        <div>
            <Auth></Auth>
            <NavBar name="navbar-home"></NavBar>
            <Reservations></Reservations>
        </div>
    )
}
export default ReservationsPage;
