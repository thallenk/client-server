import { gql } from 'apollo-server-express'

export const typeDefs = gql`
    type Demand {
        id: ID!
        name: String!
        client: Client!
        deadLine: String
    }

    extend type Query {
        demands: [Demand]!
    }
`;

export const resolvers = {
    Query: {
        demands: () => [],
    }
}