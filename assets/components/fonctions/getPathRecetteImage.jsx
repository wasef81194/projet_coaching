import React, { useEffect } from 'react';
import { API_URL } from '../../config';

async function getPathRecetteImage(id){
    const path = await fetch(API_URL+'image/reccette/'+id)
    // Transforme les données en json
    .then((res) => res.json())
    .then((json) => {
        let path = './uploads/images/recette/';
        if (json != null) {
           return path+json.path;   
        }
        else{
            return path+'default.svg'; 
        } 
    });
    return path;
}

export default getPathRecetteImage;