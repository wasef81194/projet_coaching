import React, { useEffect } from 'react';
import { API_URL } from '../../../config';
import Loader from '../layout/Loader';
import dayjs from 'dayjs';

const Rdvs = (params) => {
    const [ready, setReady] = React.useState(0);
    const [rdvs, setRdvs] = React.useState('');

    const [message, setMessage] = React.useState({
        bgColor : '',
        text : '',
        class : 'd-none'
    });
    
    useEffect(() => {
        //Récuperer les rdv de l'utilisateur connecté
        fetch(API_URL+'rdv/user/'+localStorage.getItem('id'))
        .then((json) => json.json())
        .then((json) => {
            let rdvs = json.map(rdv => (
                getCoach(rdv.coach.replace("/api/users/", "")).then((user) => {
                    rdv.coach = user;
                })
            ))
            Promise.all(rdvs).then(() => {
                setRdvs(json);
                setReady(1);
            });
            
        })
    }, []);
    
    async function getCoach(id){
        const user = await fetch(API_URL+'user/'+id)
        // Transforme les données en json
        .then((res) => res.json())
        .then((json) => {
            return json; 
        });
        return user;
    }

    console.log(rdvs);
    return ready != 1 ? (
        <Loader></Loader>
    ) : (
    <div className="container container-reservations">
        <h1>Réservations de séance</h1>
        {rdvs != '' &&
                rdvs.map((rdv, key) => (  
                    <div key={key} className="card mt-2">
                        <div className="card-body">
                        <p>{rdv.coach.firstname} {rdv.coach.lastname}</p> 
                        {rdv.confirm && 
                            <span class="badge text-bg-success mb-2">Confirmé</span>
                        }
                        {rdv.confirm == false && 
                            <span class="badge text-bg-danger mb-2">Annuler</span>
                        }
                        <p>Le : {dayjs(rdv.commence).format('DD/MM/YYYY') } de {dayjs(rdv.commence).format('hh:mm') } à {dayjs(rdv.fin).format('hh:mm') }</p>
                        <a href="#" className="btn  btn-sm btn-secondary mr-1"> <i className="bi bi-person-fill"></i> Voir profil </a>
                        </div>
                    </div>
                ))
            }
    </div>
    );
}
export default Rdvs;