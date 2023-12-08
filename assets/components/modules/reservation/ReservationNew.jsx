import React, { useEffect } from 'react';
import { API_URL } from '../../../config';
import Loader from '../layout/Loader';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

const ReservationNew = (params) => {
    const {id} = useParams(); //Pour un objet
    const [ready, setReady] = React.useState(0);
    const [disponibleDates, setDisponibleDates] = React.useState('');
    const [disponibleHoraire, setDisponibleHoraires] = React.useState('');
    const [date, setDate] = React.useState('');

    const [contentBtn, setContentBtn] = React.useState(<span><i className="bi bi-calendar-day"></i> Demander une séance </span>);
    const [disabledBtn, setDisabledBtn] = React.useState(false);
    const [message, setMessage] = React.useState({
        bgColor : '',
        text : '',
        class : 'd-none'
    });
    const [classForm, setClassForm] = React.useState('');
    useEffect(() => {
        if (id == localStorage.getItem("id")) {
            location.href = `#/coach/${id}`
        }
        console.log(new Date());
        let num = 0;
        //Récupererles reservation du coachs
        fetch(API_URL+'reservation/disponible/'+id)
        .then((json) => json.json())
        .then((json) => {
            setDisponibleHoraires(json);
            let dataKeys = Object.keys(json);
            setDisponibleDates(dataKeys);
            num += 1;
            setReady(num);
        })
    }, []);

    const hideForm = () => {
        setClassForm('d-none')
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        //Chargement du btn 
        setContentBtn(<span> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Chargement... </span>);
        setDisabledBtn(true);

        const requestOptions = {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                idUser: localStorage.getItem("id"),
                idCoach : id,
                date : date
            }),
          };

        fetch(API_URL+'new/reservation', requestOptions)
            .then(data => data.json())
            .then((data) => {
                
                console.log(data)
                if (data.code == 200) {
                    setMessage({
                        bgColor : 'alert-success',
                        text : data.message,
                        class : ''
                    });
                    hideForm();
                    setTimeout(() => {
                        location.href = `#/coach/${id}`
                    }, 3000);
                }
                else{
                    setMessage({
                        bgColor : 'alert-danger',
                        text : data.message,
                        class : ''
                    }); 
                }
                setContentBtn(<span><i className="bi bi-check-lg"></i> Ajouter cette recette</span>);
                setDisabledBtn(false);
            }
        )
    }

    const handleChangeDate = (e) => {
        var value = e.target.value;
        setDate(value);
        
    };

    console.log(disponibleDates)
    return ready != 1 ? (
        <Loader></Loader>
    ) : (
    <div className="container container-reservation">
        <a href={`#/coach/${id}`} className="btn btn-secondary btn-sm mt-1 mb-4"> <i className="bi bi-arrow-left "></i> Retour </a>
        <div className={`alert ${message.bgColor} ${message.class}`} role="alert">
            {message.text}
        </div>
        <form onSubmit={handleSubmit} className={classForm}>
            <div className="accordion" id="accordionExample">
                {disponibleDates != '' &&
                    disponibleDates.map((date, index) => (  
                        <div key={index} className={`accordion-item`}>
                            <h2 className="accordion-header">
                            <button className={`accordion-button ${ index == 0 ? '' : 'collapsed' } `} type="button" data-bs-toggle="collapse" data-bs-target={`#date${date}`} aria-expanded="false" aria-controls={`date${date}`}>
                                {date}
                            </button>
                            </h2>
                            <div id={`date${date}`} className={`accordion-collapse collapse ${ index == 0 ? 'show' : '' } `} data-bs-parent="#accordionExample">
                                <div className="accordion-body ">
                                    {disponibleHoraire[date].map((horaire, i) => (
                                        <div key={i+index} className="rdv-input"  onChange={handleChangeDate}>
                                            <input  type="radio" value={`${date}/${horaire}`} name="rdv" className="btn-check" id={`danger-outlined-${i}-${index}`} autoComplete="off" />
                                            <label className="btn btn-outline-danger" htmlFor={`danger-outlined-${i}-${index}`}>{horaire}</label>
                                        </div>
                                    ))} 
                                </div> 
                            </div>
                        </div>
                    ))
                }
            </div>
            <button type="submit" value="Envoyer"  disabled={disabledBtn} className="btn btn-success mt-3 mb-3">{contentBtn}</button>
            </form>
    </div>
    );
}
export default ReservationNew;