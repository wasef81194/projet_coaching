import React from 'react';
import { API_URL } from '../../../config';

const FormRegister = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [role, setRole] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [message, setMessage] = React.useState({
        bgColor : '',
        text : '',
        class : 'hidden'
    });

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setFirstName("");
        setLastName("");
        setRole("");

    }


    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(`
            Role: ${role}
            Email: ${email}
            Password: ${password}
            Cofirm Password: ${confirmPassword}
            FirstName: ${firstName}
            LastName: ${lastName}
        `);
        const requestOptions = {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                newUser : 1,
                email: email,
                roles: [role],
                password: password,
                confirmPassword: confirmPassword,
                firstName: firstName,
                lastName: lastName,
                description : null,
                deletedAt: null,
                deletedBy: null,
                deletedBecause: null,
                createdAt: new Date().toLocaleTimeString()
            }),
          };

        fetch(API_URL+'register/user', requestOptions)
        .then(res => res.json())
        .then((result) => {
            if (result.code == 200){
                setMessage({
                    bgColor : 'alert-success',
                    text : result.message,
                    class : ''
                });
                resetForm();
                console.log(result.message);
            }
            else{
                setMessage({
                    bgColor : 'alert-danger',
                    text : result.message,
                    class : ''
                });
                console.log(result.message);
            }
        })
        .catch(function(err){
            console.log(err);
        })      
    }
  
    return (
     <div className="card card-register">
        <h1 className="title-register">Inscription</h1>
        <div className={`alert ${message.bgColor} ${message.class}`} role="alert">
            {message.text}
        </div>

        <form onSubmit={handleSubmit}>
            <select name="role" value={role} className="form-select" onChange={e => setRole(e.target.value)}>
                <option value="">Vous êtes coach ou utilisateur ?</option>
                <option value="ROLE_COACH">Coach</option>
                <option value="ROLE_USER">Utilisateur</option>
            </select>
            <input type="text" name="firstname" className='form-control'  value={firstName}  onChange={e => setFirstName(e.target.value)} placeholder="Nom"/>
            <input type="text" name="lastname" className='form-control' value={lastName}  onChange={e => setLastName(e.target.value)} placeholder="Prénom" />
            <input type="email" name="email" className='form-control'  value={email}  onChange={e => setEmail(e.target.value)} placeholder="Email"  />
            <input type="password" name="password" className='form-control'  value={password}  onChange={e => setPassword(e.target.value)} placeholder="Mot de passe"/>
            <input type="password" name="confirmPassword" className='form-control' value={confirmPassword}  onChange={e => setConfirmPassword(e.target.value)}  placeholder="Confirmer votre mot de passe" />
            <input type="submit" value="Envoyer" className="btn btn-danger btn-send" />
        </form>
        <p className="btn-connexion"> Vous avez déja un compte ? <a href="#/auth">connectez-vous</a></p>
    </div>
    );
}
export default FormRegister;