const { filter, find } = require('lodash');
const books = require('../mocks/books.json');
const { dashboard } = require('./Query');
const resolvers = {
    Query: {
        author(parent, args, context, info) {
            return find(authors, { id: args.id });
        },
        books: () => books,
        dashboard: async () => await dashboard()
    },
    Author: {
        books(author) {
            return filter(books, { author: author.name });
        }
    }
}

module.exports = resolvers;