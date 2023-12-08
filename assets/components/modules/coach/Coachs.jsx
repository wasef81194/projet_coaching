import React from 'react';
import { API_URL } from '../../../config';
import Loader from '../layout/Loader';
import getUserAuth from '../../fonctions/getUserAuth';
import getPathUserImage from '../../fonctions/getPathUserImage';
import { Redirect } from 'react-router-dom/cjs/react-router-dom';
class Coachs extends React.Component{
    // Constructor 
    constructor(props) {
        super(props);
        this.state = {
            coachs: [],
            DataisLoaded: true,
            image:[],
            postalCode : null,
            searchInput: ''
        };
    }

    handleSearchChange = (event) => {
        this.setState({ searchInput: event.target.value });
    };

    getCoachs(maxResults){
       
        // Requete à l'api user
        const requestOptions = {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                maxResults : maxResults,
                postalCode: this.state.postalCode,
                rayon : null
            }),
        };
        fetch(API_URL+'coachs', requestOptions)
        // Transforme les données en json
        .then((json) => json.json())
        .then((json) => {
            json.map((coach, i) => {
                let path = getPathUserImage(coach.id);
                path.then((value) => {
                    coach.path = value;
                    //Change la valeur des attributs
                    this.setState({
                        coachs: json,
                    })
                    if (i == json.length -1) {
                        this.setState({
                           DataisLoaded: false,
                        })
                    }
                })
                
            })
        });
    }
    
    componentDidMount() {
        let maxResults = null;
        if (this.props.maxResults != undefined) {
            maxResults = this.props.maxResults;
        }
        let auth = getUserAuth();
        auth.then((value) => {
            this.setState({
                postalCode: value.postalCode,
            })
            this.getCoachs(maxResults)
        });
        
    }

    handleCoachClick = (coachId, event) => {
        if (coachId) {
            console.log(coachId);
            location.href = `#/coach/${coachId}`
        }
    }


    render() {
        const { DataisLoaded, coachs } = this.state;
        const { showSearchInput } = this.props; // Ajout de la variable de contrôle
        console.log(coachs);
        let filteredCoachs = coachs;
        if (this.state.searchInput.toLowerCase() != '') {
            filteredCoachs = coachs.filter(coach => coach.description && coach.description.toLowerCase().includes(this.state.searchInput.toLowerCase()));
        }
        return DataisLoaded && !this.props.maxResults ? (
            <Loader></Loader>
        ) :  (
            <div>
            {/* Condition pour afficher la barre de recherche */}
            {showSearchInput && (
                <input type="text" className='input-search form-control' value={this.state.searchInput} onChange={this.handleSearchChange} placeholder="Rechercher un coach" />
            )}
            <div className="coachs">

                {filteredCoachs.map((coach) => ( 
                    <div key={coach.id}   onClick={this.handleCoachClick.bind(this, coach.id)} className="container-coach h-100"  data-id={ coachs.id }>
                        <div className="card card-coach">
                            <img src={coach.path} className="card-img-top"/>
                            <div className="card-body">
                                <h5 className="card-title"> { coach.lastname } { coach.firstname }</h5>
                                <p className="card-text">{coach.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            </div>
        )
    }
}

export default Coachs;