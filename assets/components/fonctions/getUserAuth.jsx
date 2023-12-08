import React, { useEffect } from 'react';
import { API_URL } from '../../config';

async function getUserAuth(){
    let user =  await fetch(API_URL+'user/'+localStorage.getItem("id"))
    // Transforme les données en json
    .then((res) => res.json())
    .then((json) => {
        //Si la session ne correspond pas
        if(json && json.id == localStorage.getItem("id") && json.userIdentifier == localStorage.getItem("email") && json.password == localStorage.getItem("password")){
             return json;
        }
        else{
            return false;
        }
    });

    console.log(user);
    return user;
}

export default getUserAuth;