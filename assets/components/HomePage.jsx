import React from 'react';
import Coachs from './modules/coach/Coachs';
import Footer from './modules/layout/Footer';
import Home from './modules/layout/Home';
import NavBar from './modules/layout/NavBar';
const HomePage = (props)=>{ 
    return (
        <div>  
            <NavBar name="navbar-home"></NavBar>
            <div className="video-home">
                <video src='./uploads/video/moc.mp4' autoPlay loop muted />
            </div>
            <Home></Home>
            <div className="p-5">
                <div className="row row-cols-1 row-cols-md-2 ">
                    <div className="col">
                        <h2> Coach du moment</h2> 
                    </div>   
                    <div className="col">
                        <a href="#/coachs" className="voir-plus-coach">Voir plus <i className="bi bi-arrow-right"></i></a> 
                    </div>
                </div>
                {/* Passage de la variable showSearchInput avec la valeur false */}
                <Coachs maxResults="5" showSearchInput={false}></Coachs>
                <Footer></Footer>
            </div>
        </div>
    )
}

export default HomePage;
