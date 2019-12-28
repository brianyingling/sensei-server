
const { gql } = require('apollo-server');

const typeDefs = gql`
    type Book {
        title: String
        author: String
    }

    type Author {
        books: [Book]
    }

    type Location {
        id: String!
        name: String!
        deviceId: String!
    }

    type Reading {
        createdAt: String!
        id: String!
        scale: String!
        value: String!
        deviceId: String!
        location: Location
    }

    type Dashboard {
        readings: [Reading]
    }

    type Query {
        books: [Book]
        author: Author
        dashboard: Dashboard
    }
`;

module.exports = { typeDefs }
