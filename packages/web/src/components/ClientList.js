import React from 'react';
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'

//fazendo o query no frontend
const GET_CLIENT_LIST = gql`
    query GET_CLIENT_LIST {
        clients {
            items {
                id
                name
                email
            }
        }
    }

`;

export function ClientList() {


    //utilizando o hook useQuery para chamar o query na home
    const {
        data,
        error,
        loading,
        refetch,
        fetchMore

    } = useQuery(GET_CLIENT_LIST, {
        fetchPolicy: 'cache-and-network'
    })


    //a interrogação serve para eu pegar o client apenas se tiver o data
    const clients = data?.clients.items ?? [];


    if(error)
     return (
        <section>
            <strong>Erro ao buscar os clientes</strong>
        </section>
     )
    if(loading) 
    return(
        <section>
            <p>Carregando...</p>
        </section>
    )
    return (
        <section>
            <ul> 
                {clients.map((client) => (
                <li key={client.id}>
                    <p>{client.name}</p>
                    <p>{client.email}</p>
                </li>
            ))}

            </ul>
            <button disabled={loading}>Carregar mais</button>
        </section>
    );
}
