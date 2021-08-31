import React from 'react';
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'

//fazendo o query no frontend
const GET_CLIENT_LIST = gql`
    query GET_CLIENT_LIST($skip: Int!, $take: Int!) {
        clients(options: {
            skip: $skip
            take: $take
        }) {
            items {
                id
                name
                email
            }
            totalItems
        }
    }

`;

const PAGE_SIZE = 10;

export function ClientList({ onSelectClient }) {


    //utilizando o hook useQuery para chamar o query na home
    const {
        data,
        error,
        loading,
        fetchMore,
        called

    } = useQuery(GET_CLIENT_LIST, {
        fetchPolicy: 'cache-and-network',
        variables: {
            skip: 0,
            take: PAGE_SIZE
        },
    })


    //a interrogação serve para eu pegar o client apenas se tiver o data
    const clients = data?.clients.items ?? [];
    
    //Selecionando o client no frontend para alimentar o forms de atualização de client
    const handleSelectClient = (client) => () => onSelectClient?.(client.id);
    //função para recarregar pagina
    const handleLoadMore = () => {
        fetchMore({

            variables: {
                skip: data.clients.items.length,
                take: PAGE_SIZE
            },

            updateQuery: (result, { fetchMoreResult }) => {
                if(!fetchMoreResult) return result;
                
                return {
                    ...result,
                    clients:{
                        ...result.clients,
                        items: result.clients.items.concat(fetchMoreResult.clients.items),
                        totalItems: fetchMoreResult.clients.totalItems,
                    },
                };
            },
        });

    };



    if(error)
     return (
        <section>
            <strong>Erro ao buscar os clientes</strong>
        </section>
     )
    if(loading && !called) 
    return(
        <section>
            <p>Carregando...</p>
        </section>
    )
    return (
        <section>
            <ul> 
                {clients.map((client) => (
                <li key={client.id} onClick={handleSelectClient(client)}>
                    <p>{client.name}</p>
                    <p>{client.email}</p>
                </li>
            ))}

            </ul>
            <button type ="button" disabled={loading} onClick={handleLoadMore}>Carregar mais</button>
        </section>
    );
}
