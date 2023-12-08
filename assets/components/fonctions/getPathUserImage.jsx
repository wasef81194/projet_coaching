import { API_URL } from '../../config';

async function getPathUserImage(id){
    const path = await fetch(API_URL+'image/profil/user/'+id)
    // Transforme les données en json
    .then((res) => res.json())
    .then((json) => {
        let path = './uploads/images/user/';
        if (json != null) {
            return path+json.path;  
        }
        else{
            return path+'default.svg'; 
        } 
    });
    return path;
}

export default getPathUserImage;

