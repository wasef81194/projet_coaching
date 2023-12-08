import React, {useEffect} from "react";
import { API_URL } from "../../../config";
import Loader from "../layout/Loader";
import ShowProgramme from "../programme/ShowProgramme";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import getPathRecetteImage from '../../fonctions/getPathRecetteImage';
import getPathUserImage from '../../fonctions/getPathUserImage';
import getPathProgrammeImage from '../../fonctions/getPathProgrammeImage';
import getCatgorie from "../../fonctions/getCatgorie";

export default function Recette(params){
    const [recette, setRecette] = React.useState('');
    const [ingredients, setIngredients] = React.useState([]);
    const [coach, setCoach] = React.useState();
    const [categories, setCategories] =  React.useState([]);
    const [programmes, setProgrammes] = React.useState([]);
    const [ready, setReady] = React.useState(0);
    const [avis, setAvis]= React.useState([1,2,3,4,5]);
    const {id} = useParams(); //Pour un objet

    useEffect(() => {
        //let get = useParams();
        
        //Si un id à été identifié
        if (id) {
            let num = 0;
            //Récupère la recette
            fetch(API_URL+'recettes/'+id)
            .then((json) => json.json())
            .then((recette) => {
                console.log(recette);
                //Recupere l'image de la recette
                getPathRecetteImage(recette.id).then((value) => {
                    recette.path = value
                    setRecette(recette);
                    num += 1;
                    setReady(num)
                })
                getIngredients(recette.id).then((value) => {
                    setIngredients(value);
                    num += 1;
                    setReady(num)
                })

                getCoach(recette.user).then((coach) => {
                    
                    let path = getPathUserImage(coach.id);
                    path.then((value) => {
                        coach.path = value;
                        setCoach(coach);
                        num += 1;
                        setReady(num)
                    })
                })

                getProgrammes(recette.id).then((programmes) => {
                    if (programmes.length == 0) {
                        num += 1;
                        setReady(num)
                    }
                    let tabProgrammes = [];
                    let path = '';
                    programmes.map(programme => (
                        path = getPathProgrammeImage(programme.id),
                        path.then((value) => {
                            programme.path = value,
                            console.log(programme);
                            tabProgrammes.push(programme)

                            
                            //Si tout les programmes on été trouver
                            if (programmes.length == tabProgrammes.length) {
                                setProgrammes(tabProgrammes);
                                num += 1;
                                setReady(num)
                            }
                        })
                    ));
                    
                })

                let idCategorie = 0;
                let tabRecettes = [];
                let loop = recette.categories.map(categorie => (  
                    console.log(categorie),
                    idCategorie = categorie.replace("/api/categories/", ""),
                    getCatgorie(idCategorie).then((value) => {
                        tabRecettes.push(value);
                    })
                ))
                if(loop){
                    setCategories(tabRecettes);
                    num += 1;
                    setReady(num)
                }
            })
        }
    }, [])

    async function getIngredients(id){
        const ingredients = await fetch(API_URL+'ingredients/recette/'+id)
        // Transforme les données en json
        .then((res) => res.json())
        .then((json) => {
            return json; 
        });
        return ingredients;
    }

    async function getProgrammes(id){
        const programmes = await fetch(API_URL+'programmes/recette/'+id)
        // Transforme les données en json
        .then((res) => res.json())
        .then((json) => {
            return json; 
        });
        return programmes;
    }

    async function getCoach(url){
        var url = url.replace("/api/", "");
        const coach = await fetch(API_URL+url)
        // Transforme les données en json
        .then((res) => res.json())
        .then((json) => {
            return json; 
        });
        return coach;
    }
    
    console.log(ready);
    return ready != 5 ? (
        <Loader></Loader>
   ) : (
        <div className="container-recette">
            <div className="bandeau">
                <h1>{recette.name}</h1>
                <div className="avis"> 
                    {avis.map(avi => (
                        <i key={avi} className="bi bi-star-fill"> </i>  
                    ))}
                </div>
                <div className="flex">
                    <div className="container-ingredients">
                        <div className="coach">
                            <img src={coach.path}/>
                            <p>{coach.firstname} {coach.lastname}</p>
                            <a className="btn btn-sm btn-primary" href={`#/coach/${coach.id}`}>Voir profil</a>
                        </div>
                        
                        <p className="h3 mt-2">Ingredients</p>
                        <ul>
                            {ingredients.map(ingredient => (  
                                <li key={ingredient.id}>{ingredient.name}</li>
                            ))}
                        </ul>

                        
                    </div>
                    <img src={recette.path}/>
                </div>
            </div>
            <div className="container  mt-5">
                <div className="container-description">
                    {recette.dureeMoyen &&
                        <div className="duree mb-4">
                            <i className="bi bi-clock"></i> 
                            <div>{recette.dureeMoyen} min</div>
                        </div>
                    }
                    <p className="h3"><i className="bi bi-chat-square-dots fs-5"></i> Description</p>
                    {recette.description}
                    <p className="h3 mt-5"><i className="bi bi-grid fs-5"></i> Catégories</p>
                    <ul>
                        {categories.map(categorie => (  
                            <li key={categorie.id}>{categorie.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
            {programmes.length != 0 && 
                <div className="container mt-5">
                    <p className="h3">Programmes</p>
                    <div className="container-programmes">
                            {programmes.map(programme => ( 
                                <ShowProgramme programme={programme}></ShowProgramme>
                            ))}
                    </div>  
                </div>
            } 
        </div>
   )
}