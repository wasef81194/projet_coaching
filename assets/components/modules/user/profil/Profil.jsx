import React, { useEffect } from 'react';
import { API_URL } from '../../../../config';
import getPathUserImage from '../../../fonctions/getPathUserImage';
import getPathUserImageCover from '../../../fonctions/getPathUserImageCover';

const Profil = () => {
    const [id, setId] = React.useState("");
    const [user, setUser] = React.useState([]);
    const [imageProfil, setImageProfil] = React.useState('');
    const [imageCover, setImageCover] = React.useState('');
    const [loader, setLoader] = React.useState(true); // Chargement
    const [classLoader, setClassLoader] = React.useState('placeholder'); // class de chargement du text
    const [classLoaderImageCover, setClassLoaderImageCover] = React.useState('placeholder'); // class de chargement de la photo de couverture
    const [classLoaderImageProfil, setClassLoaderImageProfil] = React.useState('placeholder');// class de chargement de la photo de profil

    useEffect(() => {
        // Requete à l'api user
        fetch(API_URL+'user/'+localStorage.getItem("id"))
        // Transforme les données en json
        .then((res) => res.json())
        .then((json) => {
            setId(json.id);
            setUser(json);
            let imageProfil = getPathUserImage(localStorage.getItem("id"));
            imageProfil.then((value) => {
                setImageProfil(value);
                setClassLoaderImageProfil('');
            })
            let imageCover = getPathUserImageCover(localStorage.getItem("id"));
            imageCover.then((value) => {
                
                setClassLoaderImageCover('');
                setImageCover(value)
            })
            setLoader(false);
            setClassLoader('');
        });
    }, [])

    //Si un compte user est trouver
    if (user.id) {
        user.roles.forEach(role => { 
            // Et qu'il a le role coach
            if (role == 'ROLE_COACH') {
                user.isCoach = true; 
            }    
        })
    }
    return(
        <div className="container">
            <div className='profil'>
                    <div className="images">
                        <img src={`${imageCover}`} className={`${classLoaderImageCover} profil-image-cover`}/>
                        <img src={`${imageProfil}`} className={`${classLoaderImageProfil} profil-image`}/>
                        <p className={`${classLoader} profil-text`}><span className="lastname">{user.lastname}</span> <span className="firstName">{user.firstname}</span></p> 
                    </div>
                
                <div className={`placeholder-glow card`}>
                    <div className="row">
                        <div className="col">
                            <p className={`${classLoader} label`} >Description</p>
                            <p className={`${classLoader} description`}>{user.description}</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <p className={`${classLoader} label`} >Email</p>
                            <p className={`${classLoader} email`}>{user.email}</p>
                        </div>
                        <div className="col">
                            <p className={`${classLoader} label`}>Adresse</p>
                            <p className={`${classLoader}`}>{user.address}</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <p className={`${classLoader} label`}>Ville</p>
                            <p className={`${classLoader} description`}> {user.city} </p>
                        </div>
                        <div className="col">
                            <p className={`${classLoader} label`}>Code Postal</p>
                            <p className={`${classLoader} `}> {user.postalCode} </p>
                        </div>
                    </div>
                </div>

            </div>
            {user.id &&
                <div>
                    <a className="btn btn-danger mt-5 mr-5" href="#/edit/profil"><i className="bi bi-pen"></i> Modifier votre profil</a>
                    {/*<a className="btn btn-secondary mt-5" href="#/edit/profil"><i className="bi bi-lock"></i> Modifier votre mot de passe</a>*/}
                </div>
            }
        </div>
    )
}

export default Profil;