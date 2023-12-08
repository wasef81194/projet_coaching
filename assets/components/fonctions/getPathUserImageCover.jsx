import { API_URL } from '../../config';
async function getPathUserImageCover(id) {
    const path = await fetch(API_URL+'image/cover/user/'+id)
    // Transforme les données en json
    .then((res) => res.json())
    .then((json) => {
        if (json != null) {
           return json.path;   
        }
        else{
            return 'default.svg'; 
        } 
    });
    return './uploads/images/user/'+path;
}

export default getPathUserImageCover;