import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import { API_URL } from '../../config';
const Auth = () => {
    const [redirect, setRedirect] = React.useState(false);
    useEffect(() => {
        if (!localStorage.getItem("id")) {
            //Set la redirection
            setRedirect(true)
        }
        else{
            // Requete à l'api user
            fetch(API_URL+'user/'+localStorage.getItem("id"))
            // Transforme les données en json
            .then((res) => res.json())
            .then((json) => {
                //Si l'utilisateur n'existe pas dans la bdd
                if (!json.id) {
                    //Set la redirection
                    setRedirect(true)
                }
                //Si la session ne correspond pas
                else if(json.id != localStorage.getItem("id") || json.userIdentifier != localStorage.getItem("email") || json.password != localStorage.getItem("password")){
                    setRedirect(true)
                }
            });
        }
    }, [])

    //Si il n'est pas connecter
    if (redirect) {
        //Redirige vers la page de connexion
        return(
            <Redirect to="/auth" />
        )
    }
    else{
        return(
            ''
        )
    }
    
}

export default Auth;