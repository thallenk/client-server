import { gql } from 'apollo-server-express'

export const typeDefs = gql`
    interface List {
        #não posso ter nem uma lista null nem um valor dentro da lista null
        items: [Node!]!
        totalItems: Int!

    }

    enum ListSortmentEnum {
        #ascendente e descendente
        ASC 
        DESC
    }

    input ListSort {

        sorter: String!
        sortment:ListSortmentEnum!
    }

`
export const ListSortmentEnum = Object.freeze({
    ASC: 'ASC',
    DESC: 'DESC'
})
export const resolvers = {
    List: {
        __resolveType: () => null
    }
}