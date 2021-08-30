// COMENTADO POIS FOI ALTERADO PARA PROJETO EM REACT, ISSO N SERVE MAIS<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Entrar - Exemplo de Cliente/Servidor</title>
// </head>
// <body>
import React, { useState } from 'react';

export default function SignIn(){
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const handleSubmit = (event) =>{
        event.preventDefault();
        //mandar os dados para API (nesse caso o localhost)
        fetch('http://127.0.0.1:8000/authenticate',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),

            }).then((response)=> response.json())
            .then((data)=>{
                console.log('Sucess!', data)

        })
    };
    const handleEmailChange =  (event) => {
        setEmail(event.target.value)};
    const handlePasswordChange =  (event) => {
        setPassword(event.target.value)};

    return(
        // o action="/authenticate" method="POST" é substituido pelo onSubmit agora com o react.
        <form  onSubmit={handleSubmit}>
        <fieldset>
            <label htmlFor="email">E-mail</label>
            <input id="email" 
            value = {email} 
            onChange={handleEmailChange}
            type="email" 
            inputMode="email" 
            autoComplete="username"/>
        </fieldset>
        <fieldset>
            <label htmlFor="password">Senha</label>
            {/* name = "password" é trocado pelo value no react */}
            <input id="password"
             value = {password} 
             onChange={handlePasswordChange}
             type="password" 
             autoComplete="current-password"/>
        </fieldset>
        <button type="submit">Entrar</button>
    </form>
    )
}

// </body>
// </html>