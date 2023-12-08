import  ReactDOM  from 'react-dom';
import React, { useEffect,useState } from 'react';
import './styles/app.scss';
import './bootstrap';
import "bootstrap-icons/font/bootstrap-icons.css";
import { HashRouter, Route } from 'react-router-dom';
import Loader from './components/modules/layout/Loader';
import HomePage from './components/HomePage';
import CoachsPage from './components/CoachsPage';
import RegisterPage from './components/RegisterPage';
import TestPage from './components/TestPage';
import LoginPage from './components/LoginPage';
import ProfilPage from './components/ProfilPage';
import EditProfilPage from './components/EditProfilpage';
import RecettesProfilPage from './components/RecettesProfilPage';
import ProgrammesProfilPage from './components/ProgrammesProfilPage';
import RecetteNewPage from './components/RecetteNewPage';
import RecettePage from './components/RecettePage';
import ProgrammePage from './components/ProgrammePage';
import ProgrammeNewPage from './components/ProgrammeNewPage';
import CoachPage from './components/CoachPage';
import RecettesPage from './components/RecettesPage';
import ProgrammesPage from './components/ProgrammesPage';
import Logout from './components/Logout';
import ReservationNewPage from './components/ReservationNewPage';
import ReservationsPage from './components/ReservationsPage';

const $ = require('jquery');
require('bootstrap');

const App = () =>{
     const [loader, setLoader] = useState(true);

     useEffect(()=> {
          setTimeout(()=>{
               setLoader(false);
          }, 0 );
     }, []) ;

     return loader ? (
          <div className="light">
               <Loader></Loader>
          </div>
     ) : (
          <div className="light">
               <HashRouter>
                    <Route exact path="/" component={HomePage}/>

                    <Route path="/coachs" component={CoachsPage}/>
                    <Route path="/coach/:id" component={CoachPage}/>

                    <Route path="/auth" component={LoginPage}/>
                    <Route path="/register" component={RegisterPage}/>

                    <Route path="/profil" component={ProfilPage}/>
                    <Route path="/edit/profil" component={EditProfilPage}/>

                    <Route path="/my/recettes" component={RecettesProfilPage}/>
                    <Route path="/recettes" component={RecettesPage}/>
                    <Route path="/new/recette" component={RecetteNewPage}/>
                    <Route path="/recette/:id" component={RecettePage}/>

                    <Route path="/programme/:id" component={ProgrammePage}/>
                    <Route path="/my/programmes" component={ProgrammesProfilPage}/>
                    <Route path="/new/programme" component={ProgrammeNewPage}/>
                    <Route path="/programmes" component={ProgrammesPage}/>

                    <Route path="/reservation/:id" component={ReservationNewPage}/>
                    <Route path="/reservations" component={ReservationsPage}/>
                    
                    <Route path="/logout" component={Logout}/>
               </HashRouter>
          </div>
     );
}
// Dans la div app rend moi le contenu de App
const rootElement = document.querySelector("#app");
ReactDOM.render(<App/>, rootElement);

console.log(rootElement);
