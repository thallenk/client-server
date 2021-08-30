import { gql } from 'apollo-server-express'
import createReposiroty from '../io/Database/createRepository';


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
    #como é apenas um argumento, uso o input
    input ClientListOptions {
        take: Int 
        skip: Int
    }
    extend type Query {
        client(id: ID!): Client
        #inserindo paginação
        clients(options: ClientListOptions): ClientList
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
                take = 10

            } = args.options || {}

            const clients = await clientRepository.read();

            //retornando dados cliente com o id inputado
            return  {
                items: clients.slice(skip, skip+take),
                totalItems: clients.length
            }
        }
    }
}

