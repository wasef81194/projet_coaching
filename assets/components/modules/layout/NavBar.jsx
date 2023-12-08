import React, { useEffect } from 'react';
import getUserAuth from '../../fonctions/getUserAuth';

const NavBar = (props)=>{
  const [user, setUser] = React.useState([]);

  useEffect(() => {
    getUserAuth().then(result => {
      if (result) {
        result.roles.forEach(role => { 
          // Et qu'il a le role coach
          if (role == 'ROLE_COACH') {
            result.isCoach = true; 
          }    
        })
        setUser(result)
      }
    });
  }, [])

  return(
    <nav className={`navbar navbar-expand-lg ${props.name}`} >
    <div className="container-fluid">
      <a className="navbar-brand" href="/">MOC</a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarColor02">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <a className="nav-link" href="#/">Accueil
              <span className="visually-hidden">(current)</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#/coachs/">Coachs</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#/recettes/">Recettes</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#/programmes/">Programmes</a>
          </li>
        </ul>
       
        {user.id &&   //Si l'utilisateur est connecter
          <ul className="navbar-nav me-auto navbar-right">   
          {user.isCoach &&
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Profil
                </a>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#/profil">Mes informations</a></li>
                  <li><a className="dropdown-item" href="#/my/recettes">Mes recettes</a></li>
                  <li><a className="dropdown-item" href="#/my/programmes">Mes programmes</a></li>
                  <li><a className="dropdown-item" href="#/reservations">Réservations</a></li>
                </ul>
              </li>
          }

          {!user.isCoach &&
            <li className="nav-item">
              <a className="nav-link" href="#/profil" >Profil</a>
            </li>
          }
            <li className="nav-item">
              <a className="nav-link" href="#/logout" >Déconnexion</a>
            </li>    
          </ul>   
        }
        {!localStorage.getItem("id") &&        //Si l'utilisateur n'est pas connecter
          <ul className="navbar-nav me-auto navbar-right">
            <li className="nav-item">
              <a className="nav-link" href="#/auth" >Authentification</a>
            </li>  
          </ul>
        }
      </div>
    </div>
  </nav>
  )
}

export default NavBar;