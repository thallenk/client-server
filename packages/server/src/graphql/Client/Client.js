import { gql } from 'apollo-server-express'
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
    #como é apenas um argumento, uso o input
    input ClientListOptions {
        take: Int 
        skip: Int
        sort: ListSort
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
                take = 10,
                sort

            } = args.options || {}

            const clients = await clientRepository.read();

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

            //retornando dados cliente com o id inputado
            return  {
                items: clients.slice(skip, skip+take),
                totalItems: clients.length
            }
        }
    }
}

