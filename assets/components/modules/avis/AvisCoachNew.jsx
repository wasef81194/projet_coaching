import React, { useEffect } from 'react';
import { API_URL } from '../../../config';
import Loader from '../layout/Loader';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

const AvisCoachNew = (params) => {
    const {id} = useParams(); //Pour un objet
    const [ready, setReady] = React.useState(0);
   
    const [contentBtn, setContentBtn] = React.useState(<span><i className="bi bi-star-half"></i> Déposer mon avis </span>);
    const [coach, setCoach] = React.useState('');
    const [note, setNote] = React.useState('');
    const [commentaire, setCommentaire] = React.useState('');
    const [disabledBtn, setDisabledBtn] = React.useState(false);
    const [message, setMessage] = React.useState({
        bgColor : '',
        text : '',
        class : 'd-none'
    });

    useEffect(() => {
        fetch(API_URL+'coach/'+id)
        // Transforme les données en json
        .then((res) => res.json())
        .then((json) => {
            setCoach(json);
            setReady(1);
        });

    }, []);

    

    const handleSubmit = (event) => {
        event.preventDefault();
        //Chargement du btn 
        setContentBtn(<span> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Chargement... </span>);
       setDisabledBtn(true);
        console.log('START');
        const requestOptions = {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                idUser: localStorage.getItem("id"),
                idCoach : id,
                note : note,
                commentaire : commentaire
            }),
        };

        fetch(API_URL+'avis/coach/new', requestOptions)
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
                setContentBtn(<span><i className="bi bi-star-half"></i> Déposer mon avis </span>);
                setDisabledBtn(false);
            }
        )
    }

    
    return ready != 1 ? (
        <Loader></Loader>
    ) : (
    <div className="container container-reservation">
        <a href={`#/coach/${id}`} className="btn btn-secondary btn-sm mt-1 mb-4"> <i className="bi bi-arrow-left "></i> Retour </a>
        <div className="card card-new-recette mt-3 mb-3">
            <h1>Laisser un avis à {coach.firstname}  {coach.lastname}</h1>
            <div className={`alert ${message.bgColor} ${message.class}`} role="alert">
                {message.text}
            </div>
            <form onSubmit={handleSubmit}>
                <label className="form-label" htmlFor='note-coach'>Note *</label>
                <input type="number" value={note}  onChange={e => setNote(e.target.value)} min="0" max="5" name="note" className="form-control" id="note-coach"/>

                <label className="form-label" htmlFor='commentaire'>Commentaire</label>
                <textarea value={commentaire}  onChange={e => setCommentaire(e.target.value)} className="form-control" id="commentaire" name="commentaire"></textarea>
            
                <button type="submit" value="Envoyer" disabled={disabledBtn} className="btn btn-success mt-3 mb-3">{contentBtn}</button>
            </form>
        </div>
    </div>
    );
}
export default AvisCoachNew;