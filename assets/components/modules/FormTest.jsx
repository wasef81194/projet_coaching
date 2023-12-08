import React from 'react';
import { API_URL } from '../../config';

export default function FormTest() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
  
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(`
            Email: ${email}
            Password: ${password}
        `);
        const requestOptions = {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                roles: [
                    "ROLE_USER"
                ],
                password: password,
                firstname: "TEST",
                lastname: "TEST",
                description : "TEST",
                deletedAt: null,
                deletedBy: null,
                deletedBecause: null,
                createdAt: new Date().toLocaleTimeString()
            }),
          };

        fetch(API_URL+'users/', requestOptions)
            .then(async response => {
                console.log(response.json());
                console.log(requestOptions);
            })
            .then((data) => {
                 console.log(data);
            }
        )
    }
  
    return (
      <form onSubmit={handleSubmit}>
        <h1>Create Account</h1>
  
        <label>
          Email:
          <input
            name="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required />
        </label>
        
        <label>
          Password:
          <input
            name="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required />
        </label>
  
        <button>Submit</button>
      </form>
    );
  }
  