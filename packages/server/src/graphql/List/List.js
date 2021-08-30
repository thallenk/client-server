import { gql } from 'apollo-server-express'

export const typeDefs = gql`
    interface List {
        #não posso ter nem uma lista null nem um valor dentro da lista null
        items: [Node!]!
        totalItems: Int!

    }

`

export const resolvers = {
    List: {
        __resolveType: () => null
    }
}