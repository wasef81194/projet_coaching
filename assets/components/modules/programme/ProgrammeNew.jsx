import React, { useEffect } from 'react';
import { API_URL } from '../../../config';
import Loader from '../layout/Loader';
import { Player } from 'video-react';

const ProgrammeNew = () => {
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [image, setImage] = React.useState("");
    const [categories, setCategories] = React.useState([]);
    const [allCategories, setAllCategories] = React.useState("");
    const [recettes, setRecettes] = React.useState([]);
    const [allRecettes, setAllRecettes] = React.useState([]);("");

    const [contentBtn, setContentBtn] = React.useState(<span><i className="bi bi-check-lg"></i> Ajouter ce programme</span>);
    const [disabledBtn, setDisabledBtn] = React.useState(false);
    const [ready, setReady] = React.useState(true);
    const [message, setMessage] = React.useState({
        bgColor : '',
        text : '',
        class : 'hidden'
    });
    
    useEffect(() => {
        var num = 0;
        //Recupere tout les catégorie d'ingredient
        fetch(API_URL+'categories/programme')
        .then((json) => json.json())
        .then((json) => {
            setAllCategories(json)
            num += 1;
            setReady(num);
        })
        //Récupere tout les recettes de l'utilisateur
        fetch(API_URL+'recettes/user/'+localStorage.getItem("id"))
        .then((json) => json.json())
        .then((json) => {
            setAllRecettes(json)
            num += 1;
            setReady(num);
        })
        
    }, []);

    const resetForm = () => {
        setName('');
        setDescription('');
        setImage('');
        setCategories([]);
    }

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

    const handleChangeRecettes = (e) => {
        var options = e.target.options;
        var value = [];
        for (var i = 0, l = options.length; i < l; i++) {
          if (options[i].selected) {
            value.push(options[i].value);
          }
        }
        setRecettes(value);
    };

    const handleChangeImage = (e) => {
        const file = e.target.files[0];
        
        const reader = new FileReader();
        //Transforme l'image en base 64
        reader.readAsDataURL(file)
        reader.onloadend = () => {
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
                description: description,
                image: image,
                recettes : recettes,
            }),
          };

        fetch(API_URL+'new/programme', requestOptions)
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

    console.log(image);
    return ready != 2 ? (
        <Loader></Loader>
    ) : (
    <div className="container container-new-programme">
        <a href="#/my/programmes" className="btn btn-secondary btn-sm mt-1"> <i className="bi bi-arrow-left "></i> Retour </a>
        <div className="card card-new-programme mt-3 mb-3">
            <h1 className="title-register">Nouveau programme</h1>
            <div className={`alert ${message.bgColor} ${message.class}`} role="alert">
                {message.text}
            </div>

            <form onSubmit={handleSubmit}>
                 {image !='' &&
                    <div className="container-img-programme mt-3">
                        {image.substring(11,14) == 'mp4' &&
                            <Player playsInline className="programme-media"  poster="" src={image} />
                        }
                        {image.substring(11,14) != 'mp4' &&
                            <img src={image} className="programme-media" alt=""/>
                        }
                    </div>
                }
                <label className='form-label'> Ajouter un media: </label>
                <input name="img-programme" className="form-control" type="file" accept="image/png, image/jpeg, video/mp4" onChange={handleChangeImage}/>

                <label className="mt-3">Nom*</label>
                <input type="text" name="name" className='form-control'  value={name}  onChange={e => setName(e.target.value)} placeholder="Musculation"  />

                <label className="mt-3">Description*</label>
                <textarea name="description" className='form-control' onChange={e => setDescription(e.target.value)} value={description}   placeholder="Pour maximiser le développement musculaire des bras, amplifier l’afflux sanguin et la congestion musculaire..."></textarea>
                
                <label className="mt-3">Categories*</label>
                <select name="role" className="form-select" id="categorie" onChange={handleChangeCategories} multiple>
                {allCategories != '' &&
                allCategories.map(categorie => (  
                    <option key={categorie.id} value={categorie.id}>{categorie.name}</option>
                ))
                }
                </select> 

                <label className="mt-3">Recettes</label>
                <select name="role" className="form-select" id="recettes" onChange={handleChangeRecettes} multiple>
                {allRecettes != '' &&
                allRecettes.map(recette => (  
                    <option key={recette.id} value={recette.id}>{recette.name}</option>
                ))
                }
                </select> 
                <button type="submit" value="Envoyer"  disabled={disabledBtn} className="btn btn-success mt-3 mb-3">{contentBtn}</button>
            </form>
        </div>
    </div>
    );
}
export default ProgrammeNew;