import React, { useEffect } from 'react';
import { API_URL } from '../../config';

async function getCatgorie(id){
    const categorie = await fetch(API_URL+'categories/'+id)
    // Transforme les données en json
    .then((res) => res.json())
    .then((json) => {
       return json
    });
    return categorie;
}

export default getCatgorie;