import React, {useEffect} from "react";

const ShowRecette = (props) => {
    
    return (
        <div key={props.recette.id} className="card card-recette-coach">
            <img src={props.recette.path} className="card-img-top" alt=""/>
            <div className="card-body">
                <h5 className="card-title">{props.recette.name}</h5>
                <p className="card-text">{props.recette.description}</p>
                <a href={`#/recette/${props.recette.id}`} className="btn btn-primary">Voir plus</a>
            </div>
        </div>
    )
}
export default ShowRecette;