import { API_URL } from '../../config';

async function getPathProgrammeImage(id){
    const path = await fetch(API_URL+'image/programme/'+id)
    // Transforme les données en json
    .then((res) => res.json())
    .then((json) => {
        let path = './uploads/images/programme/';
        if (json != null) {
           return path+json.path;   
        }
        else{
            return path+'default.svg'; 
        } 
    });
    return path;
}

export default getPathProgrammeImage;