import React from 'react';

const Loader = (props)=>{
    return(
        <div className="loader">
            <div className="box">
                <div className="shadow"></div>
                <div className="gravity">
                    <div className="ball"></div>
                </div>
            </div>
            <div className="box-text"><p>Chargement...</p></div>
        </div>
    )
}
export default Loader;