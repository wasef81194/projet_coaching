import React, { useEffect } from 'react';
import { API_URL } from '../../../config';
import Loader from '../layout/Loader';

const RecetteNew = () => {
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [duree, setDuree] = React.useState("");
    const [image, setImage] = React.useState("");
    const [ingredients, setIngredients] = React.useState([]);
    const [allIngredients, setAllIngredients] = React.useState("");
    const [categories, setCategories] = React.useState([]);
    const [allCategories, setAllCategories] = React.useState("");
    const [programmes, setProgrammes] = React.useState([]);
    const [allProgrammes, setAllProgrammes] = React.useState("");

    const [contentBtn, setContentBtn] = React.useState(<span><i className="bi bi-check-lg"></i> Ajouter cette recette</span>);
    const [disabledBtn, setDisabledBtn] = React.useState(false);
    const [loader, setLoader] = React.useState(true);
    const [message, setMessage] = React.useState({
        bgColor : '',
        text : '',
        class : 'hidden'
    });
    
    useEffect(() => {
        //Récuperer tout les ingredients
        fetch(API_URL+'ingredients')
        .then((json) => json.json())
        .then((json) => {
            setAllIngredients(json)
        })
        //Recupere tout les catégorie d'ingredient
        fetch(API_URL+'categories/recette')
        .then((json) => json.json())
        .then((json) => {
            setAllCategories(json)
            setLoader(false);
        })
        //Récupere tout les programmes l'utilisateur
        fetch(API_URL+'programmes/user/'+localStorage.getItem("id"))
        .then((json) => json.json())
        .then((json) => {
            setAllProgrammes(json)
            setLoader(false);
        })
        
    }, []);

    const resetForm = () => {
        setName('');
        setDescription('');
        setDuree('');
        setImage('');
        setIngredients([]);
        setCategories([]);
    }


    const handleChangeIngredients = (e) => {
        var options = e.target.options;
        var value = [];
        for (var i = 0, l = options.length; i < l; i++) {
          if (options[i].selected) {
            value.push(options[i].value);
          }
        }
        setIngredients(value);
        
    };

    const handleChangeCategories = (e) => {
        var options = e.target.options;
        var value = [];
        for (var i = 0, l = options.length; i < l; i++) {
          if (options[i].selected) {
            value.push(options[i].value);
          }
        }
        setCategories(value);
        
    };

    const handleChangeProgrammes = (e) => {
        var options = e.target.options;
        var value = [];
        for (var i = 0, l = options.length; i < l; i++) {
          if (options[i].selected) {
            value.push(options[i].value);
          }
        }
        setProgrammes(value);
        
    };

    const handleChangeImage = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        //Transforme l'image en base 64
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            //Remplace l'image de profil
            setImage(reader.result);
        };
        
    };

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
                categories : categories,
                name : name,
                ingredients:ingredients,
                description: description,
                duree: duree,
                image: image,
                programmes : programmes
            }),
          };

        fetch(API_URL+'new/recette', requestOptions)
            .then(data => data.json())
            .then((data) => {
                
                console.log(data)
                if (data.code == 200) {
                    setMessage({
                        bgColor : 'alert-success',
                        text : data.message,
                        class : ''
                    });
                    resetForm();
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

    return loader ? (
        <Loader></Loader>
    ) : (
    <div className="container container-new-recette">
        <a href="#/my/recettes" className="btn btn-secondary btn-sm mt-1"> <i className="bi bi-arrow-left "></i> Retour </a>
        <div className="card card-new-recette mt-3 mb-3">
            <h1 className="title-register">Nouvelle recette</h1>
            <div className={`alert ${message.bgColor} ${message.class}`} role="alert">
                {message.text}
            </div>

            <form onSubmit={handleSubmit}>

                <label className="mt-3">Nom*</label>
                <input type="text" name="name" className='form-control'  value={name}  onChange={e => setName(e.target.value)} placeholder="Tartiflette"  />
                

                {image !='' &&
                <div className="container-img-recette mt-3">
                    <img src={image} className="image"/>
                </div>
                }

                <label className='form-label'> Ajouter une image: </label>
                <input name="img-recette" className="form-control" type="file" accept="image/png, image/jpeg" onChange={handleChangeImage}/>

                <label className="mt-3">Categories*</label>
                <select name="role" className="form-select" id="categorie" onChange={handleChangeCategories} multiple>
                {allCategories != '' &&
                allCategories.map(categorie => (  
                    <option key={categorie.id} value={categorie.id}>{categorie.name}</option>
                ))
                }
                </select> 

                <label className="mt-3">Ingredients*</label>
                <select name="role" className="form-select" onChange={handleChangeIngredients} multiple  >
                {allIngredients != '' &&
                allIngredients.map(ingredient => (  
                    <option key={ingredient.id} value={ingredient.id}>{ingredient.name}</option>
                ))
                }
                </select> 
                
                <label className="mt-3">Description*</label>
                <textarea name="description" className='form-control' onChange={e => setDescription(e.target.value)} value={description}   placeholder="Dans une grande casserole d'eau bouillante salée, faites cuire les pommes de terre préalablement épluchées. Égouttez-les et réservez-les une fois qu'elles sont bien cuites, c'est-à-dire lorsque l'on peut y enfoncer une lame de couteau sans qu'elles ne se cassent pour autant..."></textarea>
                
                <label className="mt-3">Durée moyenne (en minute)*</label>
                <input type="number" name="duree_moyen" className='form-control' value={duree}  onChange={e => setDuree(e.target.value)} placeholder="20"  />
                
                <label className="mt-3">Programmes</label>
                <select name="role" className="form-select" id="programmes" onChange={handleChangeProgrammes} multiple>
                {allProgrammes != '' &&
                allProgrammes.map(programme => (  
                    <option key={programme.id} value={programme.id}>{programme.name}</option>
                ))
                }
                </select> 

                <button type="submit" value="Envoyer"  disabled={disabledBtn} className="btn btn-success mt-3 mb-3">{contentBtn}</button>
            </form>
        </div>
    </div>
    );
}
export default RecetteNew;