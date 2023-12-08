import React from 'react';

const Home = (props)=>{ 
    return (
        <div className='container-fluid'>
            
            <div className="container container-min animate__animated animate__bounceIn">
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    <div className="col">
                        <div className="home-page-card card-cardio card text-center h-100 ">
                        <div className="card-body">
                            <h5 className="card-title mt-3">Cardio</h5>
                            <p className="card-text  mt-3">
                                Le cardio est l'une des meilleures choses que vous puissiez faire pour votre santé globale. 
                                Il renforce votre cœur, améliore votre circulation sanguine, augmente votre endurance et vous aide à brûler des calories et à perdre du poids.
                            </p>
                        </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="home-page-card card-recette card text-center h-100">
                        
                        <div className="card-body">
                            <h5 className="card-title mt-3">Recettes</h5>
                            <p className="card-text  mt-3">
                                Manger sainement est l'une des clés pour maintenir une bonne santé physique et mentale. 
                                Les aliments sains apportent les nutriments dont notre corps a besoin pour fonctionner de manière optimale. 
                                Il est important de varier notre alimentation pour obtenir un éventail complet de nutriments.
                            </p>
                        </div>
                        
                        </div>
                    </div>
                    <div className="col">
                        <div className="home-page-card card-musculation card text-center h-100">
                            <div className="card-body">
                                <h5 className="card-title mt-3">Musculation</h5>
                                <p className="card-text mt-3">
                                    La musculation est un moyen efficace pour renforcer et tonifier les muscles, améliorer la densité osseuse, augmenter la force et l'endurance, et même brûler des calories. 
                                    Cependant, il est important de suivre une approche saine pour la musculation afin de maximiser les résultats.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row row-cols-1 row-cols-md-2 presentation">
                    <div className="col media coach"> 
                        <div className="round"><img src="./uploads/images/coach-home.png"/></div>
                    </div>
                    <div className="col">
                        <h2>Trouve ton coach</h2>
                        <p className="slogan">Donnez votre meilleur effort avec un coach qui vous pousse à aller plus loin.</p>
                        <p>Les coachs sportifs sont des professionnels qui aident les athlètes à atteindre leurs objectifs de performance. 
                            Ils utilisent leur connaissance de l'anatomie, de la physiologie et de la psychologie pour élaborer des programmes d'entraînement personnalisés et pour aider les sportifs à surmonter les obstacles mentaux et physiques qui peuvent se dresser sur leur chemin.</p>
                    </div>
                </div>
                <div className="row row-cols-1 row-cols-md-2 presentation">
                    <div className="col">
                        <h2>Ton corps entend tout ce que dit ta tête</h2>
                        <p className="slogan">Travailler plus qu'hier si vous voulez un résultat demain.</p>
                        <p>C'est pourquoi il est important de maintenir une attitude mentale positive et de se fixer des objectifs clairs lorsque vous entraînez votre corps. 
                            En vous concentrant sur vos réalisations plutôt que sur vos échecs, vous pouvez vous motiver à continuer à travailler dur et à progresser dans votre entraînement.</p>
                    </div>
                    <div className="col media fitness"> 
                        <div className="round"><img src="./uploads/images/fitness-home.png"/></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Home;
