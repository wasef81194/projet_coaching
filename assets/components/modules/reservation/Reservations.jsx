import React, { useEffect } from 'react';
import { API_URL } from '../../../config';
import Loader from '../layout/Loader';
import dayjs from 'dayjs';

const Reservations = (params) => {
    const [ready, setReady] = React.useState(0);
    const [reservationsConfirme, setReservationsConfirme] = React.useState('');
    const [reservationsNonConfirme, setReservationsNonConfirme] = React.useState('');

    const [message, setMessage] = React.useState({
        bgColor : '',
        text : '',
        class : 'd-none'
    });
    
    useEffect(() => {
        let num = 0;
        //Récupererles reservation du coachs
        fetch(API_URL+'reservations/coach/'+localStorage.getItem('id'))
        .then((json) => json.json())
        .then((json) => {
            let allUserCorfirme = json.confirme.map(reservation => (
                getUser(reservation.user.replace("/api/users/", "")).then((user) => {
                    reservation.user = user;
                })
            ))
            Promise.all(allUserCorfirme).then(() => {
                setReservationsConfirme(json.confirme);
                num += 1;
                setReady(num);
            });
    
            
            let allUserNonCorfirme = json.nonConfirme.map(reservation => (
                getUser(reservation.user.replace("/api/users/", "")).then((user) => {
                    reservation.user = user;
                })
            ))
            Promise.all(allUserNonCorfirme).then(() => {
                setReservationsNonConfirme(json.nonConfirme);
                num += 1;
                setReady(num);
            });
            
        })
    }, []);

    async function getUser(id){
        const user = await fetch(API_URL+'user/'+id)
        // Transforme les données en json
        .then((res) => res.json())
        .then((json) => {
            return json; 
        });
        return user;
    }


    const confirme = (id, key) => {
        console.log(id);
        const requestOptions = {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                idReservation : id
            }),
          };

        fetch(API_URL+'reservation/confirm', requestOptions)
            .then(data => data.json())
            .then((data) => {
                reservationsConfirme.push(reservationsNonConfirme[key]);
                delete reservationsNonConfirme[key];
                setMessage({
                    bgColor : 'alert-success',
                    text : data,
                    class : ''
                });
                
            }
        )
    }

    const decline = (id, key) => {
        console.log(id);
        const requestOptions = {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                idReservation : id
            }),
          };

        fetch(API_URL+'reservation/decline', requestOptions)
            .then(data => data.json())
            .then((data) => {
                delete reservationsNonConfirme[key];
                setMessage({
                    bgColor : 'alert-success',
                    text : data,
                    class : ''
                });
                
            }
        )
    }



    console.log(reservationsNonConfirme);
    return ready != 2 ? (
        <Loader></Loader>
    ) : (
    <div className="container container-reservations">
        <h1>Réservations de séance</h1>
        <div> 
            <h4>Réservation en attante de confirmation</h4>
            <div className={`alert ${message.bgColor} ${message.class}`} role="alert">
                {message.text}
            </div>
            {reservationsNonConfirme != '' &&
                reservationsNonConfirme.map((reservation, key) => (  
                    <div key={key} className="card mt-2">
                        <div className="card-body">
                            <p>{reservation.user.firstname} {reservation.user.lastname}</p>
                            <p>Le : {dayjs(reservation.commence).format('DD/MM/YYYY') } de {dayjs(reservation.commence).format('hh:mm') } à {dayjs(reservation.fin).format('hh:mm') }</p>
                            <button onClick={() => confirme(reservation.id, key)} className="btn btn-sm btn-success mr-1"><i className="bi bi-check-circle-fill"></i> Confirmer </button>
                            <button onClick={() => decline(reservation.id, key)} className="btn  btn-sm btn-danger mr-1"><i className="bi bi-x-circle-fill"></i> Décliner </button>
                            <a href="#" className="btn  btn-sm btn-secondary mr-1"> <i className="bi bi-person-fill"></i> Voir profil </a>
                        </div>
                    </div>
                ))
            }
            {reservationsNonConfirme == '' &&
                <p >Aucune demande de réservation en attente</p>
            }
        </div>

        <div> 
            <h4>Réservation confirmé</h4>
            {reservationsConfirme != '' &&
                reservationsConfirme.map(reservation => (  
                    <div key={reservation.id} className="card mt-2">
                        <div className="card-body">
                            <p>{reservation.user.firstname} {reservation.user.lastname}</p>
                            <p>Le : {dayjs(reservation.commence).format('DD/MM/YYYY') } de {dayjs(reservation.commence).format('hh:mm') } à {dayjs(reservation.fin).format('hh:mm') }</p>
                            <a href="#" className="btn  btn-sm btn-secondary mr-1"> <i className="bi bi-person-fill"></i> Voir profil </a>
                        </div>
                    </div>
                ))
            }
            {reservationsConfirme == '' &&
                <p>Aucune réservation</p>
            }
        </div>
    </div>
    );
}
export default Reservations;