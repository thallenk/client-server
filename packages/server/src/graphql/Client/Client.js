import { gql } from 'apollo-server-express';
import * as uuid from 'uuid';
import createReposiroty from '../io/Database/createRepository';
import { ListSortmentEnum } from '../List/List';


const clientRepository = createReposiroty('client')

export const typeDefs = gql`
    type Client  implements Node {
        id: ID!
        name: String!
        email: String!
        disable: Boolean!
    }

    type ClientList implements List {
        items: [Client!]!
        totalItems: Int!
    }
    input ClientListFilter {
        name: String
        email: String
        disable: Boolean

    }
    #como é apenas um argumento, uso o input
    input ClientListOptions {
        take: Int 
        skip: Int
        filter: ClientListFilter
        sort: ListSort
    }
    extend type Query {
        client(id: ID!): Client
        #inserindo paginação
        clients(options: ClientListOptions): ClientList
    }

    input CreateClientInput {
        name: String!
        email: String!
    }

    input updateClientInput {
        id: ID!
        name: String!
        email: String!
    }


    extend type Mutation {
        createClient(input: CreateClientInput!): Client!
        updateClient(input: updateClientInput!): Client!
        deleteClient(id: ID!): Client!
        
    }
`;

export const resolvers = {
    Query: {
        client: async(
            //referencia dos dados da query anterior
            //parent, 
            _,
            { id }
        ) => {
            const clients = await clientRepository.read();
            //retornando dados cliente com o id inputado
            return clients.find((client) => client.id === id);
        },
        clients: async(_, args) => {
            const {
                skip =0,
                take = 10,
                sort,
                filter

            } = args.options || {}

            const clients = await clientRepository.read();


            // Adiciona logica para sort 
            if(sort){
                clients.sort((clientA, clientB)=>{
                    if(!['name', 'email', 'disable'].includes(sort.sorter)){
                        throw new Error(`Cannot sort by field "${sort.sorter}"`)
                    }

                    const fieldA = clientA[sort.sorter];
                    const fieldB = clientB[sort.sorter];
                    if(typeof fieldA === 'string'){
                       if(sort.sortment === ListSortmentEnum.ASC) {
                            return fieldA.localeCompare(fieldB)
                        }
                        else
                            return fieldB.localeCompare(fieldA)
                    }

                    if(sort.sortment === ListSortmentEnum.ASC) {
                        return Number(fieldA) - Number(fieldB)
                    }
                    else
                        return Number(fieldB) - Number(fieldA)
                    
                    
                })

                
            }

            //Adiciona logica para filter

            const filteredClients = clients.filter((client)=>{
                if(!filter || Object.keys(filter).length.length === 0 )
                    return true


                return Object.entries(filter).every(([field, value])=> {
                    if(client[field] === null || client[field] === undefined)
                    return false
                    if(typeof value === 'string'){
                        //pega todos os nomes que contém a palavra/silaba entre %, por ex %ra%
                        if(value.startsWith('%') && value.endsWith('%')){
                            return client[field].includes(value.substr(1,value.length - 2))
                        }
                        //pega todo o nome que termina com a silaba por ex: %na
                        if(value.startsWith('%')){
                            return client[field].endsWith(value.substr(1))
                        }
                        //pega todo o nome que começa com a silaba por ex: %Ra
                        if(value.endsWith('%')){
                            return client[field].startsWith(value.substr(0, value.length -1))
                        }
                    
                        return client[field] === value;

                    }

                    return client[field] === value;
                })
                
            })
            //retornando dados cliente com o id inputado
            return  {
                items: filteredClients.slice(skip, skip+take),
                totalItems: filteredClients.length
            }
        }
    },

    Mutation: {
        createClient: async (_, { input }) => {
            const clients = await clientRepository.read();
            // vamos utilizar a lib uuid para criação de id aleatório
            const client = {
                id: uuid.v4(),
                name: input.name,
                email: input.email,
                disable: false
            };

            await clientRepository.write([...clients, client])

            return client;
        },

        updateClient: async (_, { input }) => {
            const clients = await clientRepository.read();

            //encontrando o client através do input.id
            const currentClient = clients.find((client) => client.id === input.id);

            if(!currentClient)
                throw new Error(`No client with this id "${input.id}"`)


            // vamos utilizar a lib uuid para criação de id aleatório
            const updatedClient = {
                ...currentClient,
                name: input.name,
                email: input.email,
                disable: false
            };

            const updatedClients = clients.map((client) => {
                if (client.id === updatedClient.id)
                    return updatedClient

                return client
            })

            await clientRepository.write(updatedClients)

            return updatedClient;
        },

        deleteClient: async (_, { id }) => {
            const clients = await clientRepository.read();

            //encontrando o client através do input.id
            const client = clients.find((client) => client.id === id);

            if(!client)
                throw new Error(`Cannot delete client with id "${id}"`)

            // "deletando" client através de um filtro 
            const updatedClients = clients.filter(client => client.id !== id)
                await clientRepository.write(updatedClients)
            
            return client

        }
    }
}

