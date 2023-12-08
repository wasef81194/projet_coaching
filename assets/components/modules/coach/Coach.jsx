import React, {useEffect} from "react";
import { API_URL } from "../../../config";
import Loader from "../layout/Loader";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import getPathProgrammeImage from "../../fonctions/getPathProgrammeImage";
import { Player } from "video-react";
import getPathRecetteImage from "../../fonctions/getPathRecetteImage";
import ShowRecette from "../recette/ShowRecette";
import getPathUserImage from "../../fonctions/getPathUserImage";
import getPathUserImageCover from "../../fonctions/getPathUserImageCover";
import ShowProgramme from "../programme/ShowProgramme"

export default function Coach(params){
    const [coach, setCoach] = React.useState();
    const [ready, setReady] = React.useState(0);
    const [recettes, setRecettes] = React.useState('');
    const [programmes, setProgrammes] = React.useState('');
    const [avis, setAvis]= React.useState([1,2,3,4,5]);
    const {id} = useParams(); //Pour un objet

    useEffect(() => {
        //Si un id à été identifié
        if (id) {
            let num = 0;
            //Récupère la recette
            fetch(API_URL+'coach/'+id)
            .then((json) => json.json())
            .then((coach) => {
                //Si un coach n'existe pas
                if (!coach) {
                    location.href = `#/coachs/`
                }
                getPathUserImage(coach.id).then((path) => {
                    coach.profil = path
                    num += 1;
                    setReady(num);
                })
                getPathUserImageCover(coach.id).then((path) => {
                    coach.cover = path
                    setCoach(coach);
                    num += 1;
                    setReady(num);
                })

                fetch(API_URL+'recettes/user/'+coach.id)
                .then((json) => json.json())
                .then((recettes) => {
                    console.log(recettes)
                    let requests = recettes.map(recette => (
                        getPathRecetteImage(recette.id).then((value) => {
                            console.log(value)
                            recette.path = value
                        })
                    ))
                    Promise.all(requests).then(() => {
                        setRecettes(recettes);
                        num += 1;
                        setReady(num);
                    })
                })

                fetch(API_URL+'programmes/user/'+coach.id)
                .then((json) => json.json())
                .then((programmes) => {
                    console.log(programmes);
                    let requests = programmes.map(programme => (
                        getPathProgrammeImage(programme.id).then((value) => {
                            programme.path = value
                        })
                    ))
                    Promise.all(requests).then(() => {
                        setProgrammes(programmes);
                        num += 1;
                        setReady(num);
                    })
                })
                

            })
        }
        else{
            location.href = `#/coachs/`
        }
    }, [])

    console.log(coach);
    return ready != 4 ? (
        <Loader></Loader>
   ) : (
        <div className="container-coach">
           <div className="bandeau">
                <h1>{coach.firstname} {coach.lastname}</h1>
                <div className="avis"> 
                    {avis.map(avi => (
                        <i key={avi} className="bi bi-star-fill"> </i>  
                    ))}
                </div>
                <div className="container-media">
                    <img className="image-cover" src={coach.cover}/>
                    <img className="image-profil" src={coach.profil}/>
                </div>
           </div>
           <div className="container rdv">
                <a href={`#/reservation/${id}`} className="btn btn-primary mt-5 mb-5"> <i className="bi bi-calendar-day"></i> Demander une seance</a>
            </div>
            <div className="container container-detail ">
                {coach.city != '' &&
                    <div className="city mb-4">
                        <i className="bi bi-house"></i>
                        <div>{coach.city} {coach.postalCode}</div>
                    </div>
                }
                {coach.description != '' &&
                    <div className="container-description">

                        <p className="h3"><i className="bi bi-chat-square-dots fs-5"></i> Description</p>
                        {coach.description}
                    </div>
                }
                
            </div>

            {programmes != '' &&
                <div className="container  programmes mt-4">
                    <p className="h3">Programmes</p>
                    <div className="container-programmes">
                        {programmes != '' &&
                            programmes.map(programme => (  
                                <ShowProgramme programme={programme}></ShowProgramme>
                            ))
                        }
                    </div>
                </div>
            }

            {recettes != '' &&
                <div className="container recettes mt-4">
                    <p className="h3">Recettes</p>
                    <div className="container-recettes">
                        {recettes != '' &&
                            recettes.map(recette => (  
                                <ShowRecette recette={recette}></ShowRecette>
                            ))
                        }
                    </div>
                </div>
            }
        </div>
   )
}