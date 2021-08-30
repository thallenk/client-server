//import { createServer } from 'http';
//vamos usar o fs para poder carregar as coisas no nosso server de forma assincrona
// import { readFile } from 'fs';
// // o resolve faz com que eu pegue o caminho do modulo sem ter q usar o root(src)
// import { resolve } from 'path';
// //para poder pegar os dados de email e senha de forma legivel em objeto
//import { parse } from 'querystring';
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import  typeDefs  from './graphql/typeDefs'
import  resolvers  from './graphql/resolvers'
// criando server com express
const app = express()

const server = new ApolloServer({
    
    // declarando graphos (entidades) onde podemos fazer relações entre os dados. a interrogação é para dizer que é algo obrigatorio de ter
    typeDefs: typeDefs,
  resolvers: resolvers
})


server.applyMiddleware({
    app,
    cors:{
        origin: 'http://localhost:3000',
    },
    bodyParserConfig: true
})
//status e authenticate com express ignorado para implementar com o apollo server
// server.get('/status',(_, response)=>{
//     response.send({
//         status:"Okay"
//     })
// })

// const enableCors = cors({origin: 'http://localhost:3000'})
// //os dados que serão enviado pelo front com react agora são postados aq:
// server
// .options('/authenticate',enableCors) //resolvendo problema de cors
// .post('/authenticate',enableCors, express.json(), (request,response)=>{
//     console.log(
//         'E-mail', request.body.email,
//         'Senha', request.body.password
//     )
//     response.send({
//         Okay: true,
//     })
// })

// tudo isso embaixo é feito nas linhas 10 a 23 com o express
// const server = createServer((request, response) => {
//     switch(request.url){

        // case '/status': {
        //     //colocando um json no server
        //     response.writeHead(200, {
        //         'Content-type': 'application/json',
        //     });
        //     response.write(
        //         JSON.stringify({
        //         status:"okay",
        //     }));
        //     response.end();
        //     break;
       // }
        // case '/home':{
        //     const path = resolve(__dirname, './pages/home.html')
        //     readFile(path,(error, file)=>{
        //         if(error){
        //             response.writeHead(500, "Can't process HTML file.")
        //             response.end();
        //             return
        //         }
        //         response.writeHead(200);
        //         response.write(file);
        //         response.end();

                
        //     })
        //     break;

        //     break;
        // }
        // case '/sign-in':{
        //     //eu preciso dizer onde estar o arquivo que sera lido/escrito
        //     const path = resolve(__dirname, './pages/sign-in.html')
        //     readFile(path,(error, file)=>{
        //         if(error){
        //             response.writeHead(500, "Can't process HTML file.")
        //             response.end();
        //             return
        //         }
        //         response.writeHead(200);
        //         response.write(file);
        //         response.end();

                
        //     })
        //     break;
        // }
//         case '/authenticate':{
//             let data = '';
//             request.on('data',(chunk)=>{
//                 data = data + chunk;
//             });
//             request.on('end', ()=>{
//                 const params = parse(data);
//                 // response.writeHead(301, {
//                 //     Location: '/home',
//                 // });
//                 response.end();

//             });
//             break;
//         }
//         default: {
//             response.writeHead(404, 'Service not found.');
//             response.end();
//         }
//     }
// });
//configurando a porta da aplicação em caso de estar usando mais de uma porta ao mesmo tempo
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8000;
//como o host ja vem como string podemos utilizar um operador logico
const HOSTNAME = process.env.HOSTNAME || '127.0.0.1';

app.listen(8000, '127.0.0.1', ()=>{
    console.log(`Server is listening at http://${HOSTNAME}:${PORT}.`)
});